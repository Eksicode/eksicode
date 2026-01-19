import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark' | 'auto';

function createThemeStore() {
	const { subscribe, set } = writable<Theme>('auto');

	return {
		subscribe,
		
		set: (theme: Theme) => {
			set(theme);
			if (browser) {
				localStorage.setItem('theme', theme);
				applyTheme(theme);
			}
		},

		init: () => {
			if (browser) {
				const stored = localStorage.getItem('theme') as Theme | null;
				const theme = stored || 'auto';
				set(theme);
				applyTheme(theme);
			}
		}
	};
}

function applyTheme(theme: Theme) {
	if (!browser) return;

	const root = document.documentElement;
	
	if (theme === 'auto') {
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		if (prefersDark) {
			root.classList.add('dark');
		} else {
			root.classList.remove('dark');
		}
	} else if (theme === 'dark') {
		root.classList.add('dark');
	} else {
		root.classList.remove('dark');
	}
}

// Watch for system theme changes
if (browser) {
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
		const stored = localStorage.getItem('theme') as Theme | null;
		if (!stored || stored === 'auto') {
			applyTheme('auto');
		}
	});
}

export const themeStore = createThemeStore();
