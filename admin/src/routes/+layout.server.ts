import { redirect } from '@sveltejs/kit';
import { PUBLIC_API_URL } from '$env/static/public';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const token = cookies.get('auth_token');

	// Allow access to login page without auth
	if (url.pathname === '/login') {
		return {};
	}

	// Redirect to login if no token
	if (!token) {
		throw redirect(302, '/login');
	}

	// Verify token and check roles
	try {
		const apiUrl = PUBLIC_API_URL;

		if (!apiUrl) {
			console.error('[Auth] PUBLIC_API_URL is not configured');
			throw redirect(302, '/login?error=config');
		}

		const response = await fetch(`${apiUrl}/auth/me`, {
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			console.error(`[Auth] Token validation failed: ${response.status}`);
			// Clear invalid token
			cookies.delete('auth_token', { path: '/' });
			throw redirect(302, '/login');
		}

		const result = await response.json();
		const user = result.data || result;
		const roles = user?.roles || [];

		// Check if user has admin, superadmin, or moderator role
		const allowedRoles = ['admin', 'superadmin', 'moderator'];
		const hasAccess = roles.some((role: string) => allowedRoles.includes(role.toLowerCase()));

		if (!hasAccess) {
			console.error(`[Auth] User lacks required role. Has: ${roles.join(', ')}`);
			cookies.delete('auth_token', { path: '/' });
			throw redirect(302, '/login?error=unauthorized');
		}

		return {
			user,
			token
		};
	} catch (error: unknown) {
		// Re-throw redirect errors
		if (error && typeof error === 'object' && 'status' in error) {
			throw error;
		}

		console.error('[Auth] Unexpected error:', error);
		cookies.delete('auth_token', { path: '/' });
		throw redirect(302, '/login');
	}
};
