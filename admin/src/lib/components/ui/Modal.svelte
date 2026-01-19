<script lang="ts">
	export let isOpen: boolean = false;
	export let title: string = '';
	export let onClose: () => void;
	export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';

	const sizeClasses = {
		sm: 'max-w-md',
		md: 'max-w-2xl',
		lg: 'max-w-4xl',
		xl: 'max-w-6xl'
	};

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onClose();
		}
	}

	function handleEscape(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window on:keydown={handleEscape} />

{#if isOpen}
	<div
		class="fixed inset-0 z-50 overflow-y-auto"
		aria-labelledby="modal-title"
		role="dialog"
		aria-modal="true"
	>
		<div
			class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
		>
			<!-- Background overlay -->
			<div
				class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity"
				aria-hidden="true"
				on:click={handleBackdropClick}
			></div>

			<!-- Center modal -->
			<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
				>&#8203;</span
			>

			<div
				class="inline-block align-bottom bg-white dark:bg-DarkerGrey rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full {sizeClasses[
					size
				]}"
			>
				<div
					class="bg-white dark:bg-DarkerGrey px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200 dark:border-DarkLightGrey"
				>
					<div class="flex items-center justify-between">
						<h3
							class="text-lg leading-6 font-medium text-gray-900 dark:text-white"
							id="modal-title"
						>
							{title}
						</h3>
						<button
							type="button"
							class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
							on:click={onClose}
						>
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				</div>
				<div class="bg-white dark:bg-DarkerGrey px-4 pt-5 pb-4 sm:p-6">
					<slot />
				</div>
			</div>
		</div>
	</div>
{/if}
