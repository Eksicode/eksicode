<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { authStore } from '$lib/auth/store';
	import { goto } from '$app/navigation';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	let isInitializing = true;

	onMount(async () => {
		// Initialize auth store from server data
		if (data?.user && data?.token) {
			authStore.setUser(data.user);
			authStore.setToken(data.token);
			isInitializing = false;
		} else if (!$page.url.pathname.startsWith('/login')) {
			// Check authentication on mount if no server data
			const isAuthenticated = await authStore.checkAuth();
			if (!isAuthenticated) {
				goto('/login');
			}
			isInitializing = false;
		} else {
			isInitializing = false;
		}
	});
</script>

{#if isInitializing && !$page.url.pathname.startsWith('/login')}
	<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-DarkerGrey">
		<div class="text-center">
			<svg
				class="animate-spin h-8 w-8 text-eksiCode mx-auto"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle
					class="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					stroke-width="4"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
			<p class="mt-4 text-sm text-gray-600 dark:text-gray-400">Yükleniyor...</p>
		</div>
	</div>
{:else}
	<main>
		<slot />
	</main>
{/if}
