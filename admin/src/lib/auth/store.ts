import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { User } from '../api/types';
import { apiClient } from '../api/client';

interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}

const createAuthStore = () => {
	const { subscribe, set, update } = writable<AuthState>({
		user: null,
		token: null,
		isAuthenticated: false,
		isLoading: true
	});

	return {
		subscribe,
		setToken: (token: string) => {
			if (browser) {
				// Use Secure flag in production (HTTPS)
				const isSecure = window.location.protocol === 'https:';
				const cookieOptions = [
					`auth_token=${token}`,
					'path=/',
					'max-age=86400',
					'SameSite=Lax',
					isSecure ? 'Secure' : ''
				].filter(Boolean).join('; ');
				document.cookie = cookieOptions;
			}
			update((state) => ({
				...state,
				token,
				isAuthenticated: !!token
			}));
		},
		setUser: (user: User) => {
			update((state) => ({
				...state,
				user,
				isAuthenticated: !!user
			}));
		},
		checkAuth: async (): Promise<boolean> => {
			if (!browser) return false;

			update((state) => ({ ...state, isLoading: true }));

			try {
				const token = getCookie('auth_token');
				if (!token) {
					update((state) => ({
						...state,
						isLoading: false,
						isAuthenticated: false
					}));
					return false;
				}

				const response = await apiClient.get<any>('/auth/me', token);
				if (response.success && response.data) {
					const responseData = response.data as any;
					const user = responseData.data || responseData;
					const roles = user.roles || [];
					const allowedRoles = ['admin', 'superadmin', 'moderator'];
					const hasAccess = roles.some((role: string) =>
						allowedRoles.includes(role.toLowerCase())
					);

					if (hasAccess) {
						update((state) => ({
							...state,
							user,
							token,
							isAuthenticated: true,
							isLoading: false
						}));
						return true;
					}
				}

				update((state) => ({
					...state,
					isLoading: false,
					isAuthenticated: false
				}));
				return false;
			} catch (error) {
				update((state) => ({
					...state,
					isLoading: false,
					isAuthenticated: false
				}));
				return false;
			}
		},
		logout: () => {
			if (browser) {
				document.cookie = 'auth_token=; path=/; max-age=0';
			}
			set({
				user: null,
				token: null,
				isAuthenticated: false,
				isLoading: false
			});
		},
		hasRole: (role: string): boolean => {
			let hasRole = false;
			subscribe((state) => {
				hasRole = state.user?.roles?.some((r) => r.toLowerCase() === role.toLowerCase()) || false;
			})();
			return hasRole;
		},
		hasPermission: (permission: string): boolean => {
			let hasPermission = false;
			subscribe((state) => {
				hasPermission = state.user?.permissions?.some((p) => p.toLowerCase() === permission.toLowerCase()) || false;
			})();
			return hasPermission;
		}
	};
};

function getCookie(name: string): string | null {
	if (!browser) return null;
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
	return null;
}

export const authStore = createAuthStore();
