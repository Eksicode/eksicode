<script lang="ts">
	export let columns: { key: string; label: string; sortable?: boolean }[] = [];
	export let data: any[] = [];
	export let onEdit: ((item: any) => void) | null = null;
	export let onDelete: ((item: any) => void) | null = null;
	export let onView: ((item: any) => void) | null = null;
	export let loading: boolean = false;

	function getValue(item: any, key: string) {
		const keys = key.split('.');
		let value = item;
		for (const k of keys) {
			if (value && typeof value === 'object') {
				value = value[k];
			} else {
				return '-';
			}
		}
		return value ?? '-';
	}

	function formatValue(value: any): string {
		if (value === null || value === undefined) return '-';
		if (typeof value === 'boolean') return value ? 'Evet' : 'Hayır';
		if (Array.isArray(value)) return value.join(', ');
		if (typeof value === 'object') return JSON.stringify(value);
		if (typeof value === 'string' && value.includes('T') && value.includes('Z')) {
			// Format date
			return new Date(value).toLocaleDateString('tr-TR', {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			});
		}
		return String(value);
	}
</script>

<div class="overflow-x-auto">
	<table class="min-w-full divide-y divide-gray-200 dark:divide-DarkLightGrey">
		<thead class="bg-gray-50 dark:bg-DarkLightGrey">
			<tr>
				{#each columns as column}
					<th
						scope="col"
						class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
					>
						{column.label}
					</th>
				{/each}
				{#if onEdit || onDelete || onView}
					<th
						scope="col"
						class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
					>
						İşlemler
					</th>
				{/if}
			</tr>
		</thead>
		<tbody
			class="bg-white dark:bg-DarkerGrey divide-y divide-gray-200 dark:divide-DarkLightGrey"
		>
			{#if loading}
				<tr>
					<td colspan={columns.length + 1} class="px-6 py-4 text-center">
						<div class="flex justify-center items-center">
							<svg
								class="animate-spin h-8 w-8 text-blue-600"
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
						</div>
					</td>
				</tr>
			{:else if data.length === 0}
				<tr>
					<td
						colspan={columns.length + 1}
						class="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
					>
						Kayıt bulunamadı
					</td>
				</tr>
			{:else}
				{#each data as item, i}
					<tr class="hover:bg-gray-50 dark:hover:bg-DarkLightGrey transition-colors">
						{#each columns as column}
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
								{formatValue(getValue(item, column.key))}
							</td>
						{/each}
						{#if onEdit || onDelete || onView}
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
								{#if onView}
									<button
										on:click={() => onView && onView(item)}
										class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
									>
										Görüntüle
									</button>
								{/if}
								{#if onEdit}
									<button
										on:click={() => onEdit && onEdit(item)}
										class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
									>
										Düzenle
									</button>
								{/if}
								{#if onDelete}
									<button
										on:click={() => onDelete && onDelete(item)}
										class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
									>
										Sil
									</button>
								{/if}
							</td>
						{/if}
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>
