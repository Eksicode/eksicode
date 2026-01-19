import { writable } from 'svelte/store';

export interface Toast {
	id: string;
	type: 'success' | 'error' | 'warning' | 'info';
	message: string;
}

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	return {
		subscribe,
		add: (type: Toast['type'], message: string, duration = 5000) => {
			const id = Math.random().toString(36).substr(2, 9);
			update((toasts) => [...toasts, { id, type, message }]);

			if (duration > 0) {
				setTimeout(() => {
					update((toasts) => toasts.filter((t) => t.id !== id));
				}, duration);
			}
		},
		remove: (id: string) => {
			update((toasts) => toasts.filter((t) => t.id !== id));
		},
		success: (message: string, duration?: number) => {
			createToastStore().add('success', message, duration);
		},
		error: (message: string, duration?: number) => {
			createToastStore().add('error', message, duration);
		},
		warning: (message: string, duration?: number) => {
			createToastStore().add('warning', message, duration);
		},
		info: (message: string, duration?: number) => {
			createToastStore().add('info', message, duration);
		}
	};
}

export const toastStore = createToastStore();
