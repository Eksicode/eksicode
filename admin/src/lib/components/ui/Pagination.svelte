<script lang="ts">
	export let currentPage: number = 1;
	export let totalPages: number = 1;
	export let onPageChange: (page: number) => void;
	export let totalItems: number = 0;
	export let itemsPerPage: number = 10;

	$: startItem = (currentPage - 1) * itemsPerPage + 1;
	$: endItem = Math.min(currentPage * itemsPerPage, totalItems);

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			onPageChange(page);
		}
	}

	function getPageNumbers(): (number | string)[] {
		const pages: (number | string)[] = [];
		const maxPagesToShow = 7;

		if (totalPages <= maxPagesToShow) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			pages.push(1);

			if (currentPage > 3) {
				pages.push('...');
			}

			const startPage = Math.max(2, currentPage - 1);
			const endPage = Math.min(totalPages - 1, currentPage + 1);

			for (let i = startPage; i <= endPage; i++) {
				pages.push(i);
			}

			if (currentPage < totalPages - 2) {
				pages.push('...');
			}

			pages.push(totalPages);
		}

		return pages;
	}

	$: pageNumbers = getPageNumbers();
</script>

<div class="flex items-center justify-between border-t border-gray-200 dark:border-DarkLightGrey bg-white dark:bg-DarkerGrey px-4 py-3 sm:px-6">
	<div class="flex-1 flex justify-between sm:hidden">
		<button
			on:click={() => goToPage(currentPage - 1)}
			disabled={currentPage === 1}
			class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-DarkLightGrey text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-DarkerGrey hover:bg-gray-50 dark:hover:bg-DarkLightGrey disabled:opacity-50 disabled:cursor-not-allowed"
		>
			Önceki
		</button>
		<button
			on:click={() => goToPage(currentPage + 1)}
			disabled={currentPage === totalPages}
			class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-DarkLightGrey text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-DarkerGrey hover:bg-gray-50 dark:hover:bg-DarkLightGrey disabled:opacity-50 disabled:cursor-not-allowed"
		>
			Sonraki
		</button>
	</div>
	<div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
		<div>
			<p class="text-sm text-gray-700 dark:text-gray-300">
				<span class="font-medium">{startItem}</span>
				-
				<span class="font-medium">{endItem}</span>
				/
				<span class="font-medium">{totalItems}</span>
				sonuç gösteriliyor
			</p>
		</div>
		<div>
			<nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
				<button
					on:click={() => goToPage(currentPage - 1)}
					disabled={currentPage === 1}
					class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-DarkLightGrey bg-white dark:bg-DarkerGrey text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-DarkLightGrey disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<span class="sr-only">Önceki</span>
					<svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
					</svg>
				</button>
				{#each pageNumbers as page}
					{#if page === '...'}
						<span
							class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-DarkLightGrey bg-white dark:bg-DarkerGrey text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							...
						</span>
					{:else}
						<button
							on:click={() => goToPage(Number(page))}
							class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-DarkLightGrey text-sm font-medium {currentPage === page
								? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-200'
								: 'bg-white dark:bg-DarkerGrey text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-DarkLightGrey'}"
						>
							{page}
						</button>
					{/if}
				{/each}
				<button
					on:click={() => goToPage(currentPage + 1)}
					disabled={currentPage === totalPages}
					class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-DarkLightGrey bg-white dark:bg-DarkerGrey text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-DarkLightGrey disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<span class="sr-only">Sonraki</span>
					<svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
					</svg>
				</button>
			</nav>
		</div>
	</div>
</div>
