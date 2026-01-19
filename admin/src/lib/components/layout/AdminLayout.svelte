<script lang="ts">
	import Sidebar from './Sidebar.svelte';
	import Header from './Header.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { authStore } from '$lib/auth/store';
</script>

<div class="flex min-h-screen bg-gray-50 dark:bg-DarkerGrey">
	<Sidebar />
	<div class="flex-1 flex flex-col">
		<Header />
		<main class="flex-1 p-6">
			<slot />
		</main>
	</div>
</div>

<Toast />
