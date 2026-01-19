<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { toastStore } from '$lib/stores/toast';

	$: toasts = $toastStore;

	function getIcon(type: string) {
		switch (type) {
			case 'success':
				return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
			case 'error':
				return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
			case 'warning':
				return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
			case 'info':
			default:
				return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
		}
	}

	function getColor(type: string) {
		switch (type) {
			case 'success':
				return 'text-green-400';
			case 'error':
				return 'text-red-400';
			case 'warning':
				return 'text-yellow-400';
			case 'info':
			default:
				return 'text-blue-400';
		}
	}
</script>

<div class="fixed top-4 right-4 z-50 space-y-2">
	{#each toasts as toast (toast.id)}
		<div
			in:fly={{ x: 300, duration: 300 }}
			out:fade={{ duration: 200 }}
			class="max-w-sm w-full bg-white dark:bg-DarkerGrey shadow-lg rounded-lg pointer-events-auto border border-gray-200 dark:border-DarkLightGrey"
		>
			<div class="p-4">
				<div class="flex items-start">
					<div class="flex-shrink-0">
						<svg
							class="h-6 w-6 {getColor(toast.type)}"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d={getIcon(toast.type)}
							/>
						</svg>
					</div>
					<div class="ml-3 w-0 flex-1 pt-0.5">
						<p class="text-sm font-medium text-gray-900 dark:text-white">
							{toast.message}
						</p>
					</div>
					<div class="ml-4 flex-shrink-0 flex">
						<button
							on:click={() => toastStore.remove(toast.id)}
							class="bg-white dark:bg-DarkerGrey rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
						>
							<span class="sr-only">Kapat</span>
							<svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	{/each}
</div>
