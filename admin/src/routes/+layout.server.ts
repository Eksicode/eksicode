import { redirect } from '@sveltejs/kit';
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
		// In server-side code, we can use import.meta.env or process.env
		// For SvelteKit, we'll use import.meta.env which works in both server and client
		const apiUrl = import.meta.env.PUBLIC_API_URL;
		const response = await fetch(`${apiUrl}/auth/me`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		if (!response.ok) {
			throw redirect(302, '/login');
		}

		const result = await response.json();
		const user = result.data || result;
		const roles = user?.roles || [];

		// Check if user has admin, superadmin, or moderator role
		const allowedRoles = ['admin', 'superadmin', 'moderator'];
		const hasAccess = roles.some((role: string) => allowedRoles.includes(role.toLowerCase()));

		if (!hasAccess) {
			throw redirect(302, '/login?error=unauthorized');
		}

		return {
			user,
			token
		};
	} catch (error) {
		if (error instanceof Response && error.status === 302) {
			throw error;
		}
		if (error && typeof error === 'object' && 'status' in error && error.status === 302) {
			throw error;
		}
		throw redirect(302, '/login');
	}
};
