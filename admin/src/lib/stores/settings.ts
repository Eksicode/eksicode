import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface SystemSettings {
	// General Settings
	siteName: string;
	siteDescription: string;
	siteUrl: string;
	adminEmail: string;
	
	// Content Settings
	postsPerPage: number;
	commentsPerPage: number;
	allowGuestComments: boolean;
	moderationRequired: boolean;
	
	// Security Settings
	requireEmailVerification: boolean;
	maxLoginAttempts: number;
	sessionTimeout: number;
	twoFactorEnabled: boolean;
	
	// Email Settings
	emailHost: string;
	emailPort: number;
	emailUser: string;
	emailFrom: string;
	emailSecure: boolean;
	
	// API Settings
	apiRateLimit: number;
	apiTimeout: number;
	enableApiDocs: boolean;
	
	// Notification Settings
	emailNotifications: boolean;
	browserNotifications: boolean;
	digestFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'never';
}

const defaultSettings: SystemSettings = {
	siteName: 'EksiCode',
	siteDescription: 'Yazılım Geliştirme Topluluğu',
	siteUrl: 'https://eksicode.com',
	adminEmail: 'admin@eksicode.com',
	postsPerPage: 20,
	commentsPerPage: 10,
	allowGuestComments: false,
	moderationRequired: true,
	requireEmailVerification: true,
	maxLoginAttempts: 5,
	sessionTimeout: 3600,
	twoFactorEnabled: false,
	emailHost: '',
	emailPort: 587,
	emailUser: '',
	emailFrom: 'noreply@eksicode.com',
	emailSecure: true,
	apiRateLimit: 100,
	apiTimeout: 30000,
	enableApiDocs: true,
	emailNotifications: true,
	browserNotifications: false,
	digestFrequency: 'daily'
};

function createSettingsStore() {
	const { subscribe, set, update } = writable<SystemSettings>(defaultSettings);

	return {
		subscribe,
		
		// Load settings from localStorage
		loadFromStorage: () => {
			if (browser) {
				const stored = localStorage.getItem('admin_settings');
				if (stored) {
					try {
						const parsed = JSON.parse(stored);
						update(current => ({ ...current, ...parsed }));
					} catch (error) {
						console.error('Error loading settings from storage:', error);
					}
				}
			}
		},

		// Save settings to localStorage
		saveToStorage: (settings: Partial<SystemSettings>) => {
			if (browser) {
				update(current => {
					const updated = { ...current, ...settings };
					localStorage.setItem('admin_settings', JSON.stringify(updated));
					return updated;
				});
			}
		},

		// Update a specific setting
		updateSetting: <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => {
			update(current => {
				const updated = { ...current, [key]: value };
				if (browser) {
					localStorage.setItem('admin_settings', JSON.stringify(updated));
				}
				return updated;
			});
		},

		// Reset to defaults
		reset: () => {
			set(defaultSettings);
			if (browser) {
				localStorage.removeItem('admin_settings');
			}
		},

		// Bulk update settings
		bulkUpdate: (settings: Partial<SystemSettings>) => {
			update(current => {
				const updated = { ...current, ...settings };
				if (browser) {
					localStorage.setItem('admin_settings', JSON.stringify(updated));
				}
				return updated;
			});
		}
	};
}

export const settingsStore = createSettingsStore();
