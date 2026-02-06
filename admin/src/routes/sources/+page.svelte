<script lang="ts">
	import { onMount } from 'svelte';
	import AdminLayout from '$lib/components/layout/AdminLayout.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import { getData, addData, updateData, deleteData } from '$lib/utils/api';
	import { toastStore } from '$lib/stores/toast';

	const pageTitle = 'Kaynak Yonetimi | Admin Panel';

	interface Source {
		id: number;
		title: string;
		url: string;
		description?: string | null;
		groupName?: string | null;
		tgChannel?: string | null;
		tgUser?: string | null;
		tgUsername?: string | null;
		active: boolean;
		approved: boolean;
		tags?: { id: number; name: string }[];
		createdAt: string;
		updatedAt: string;
	}

	let sources: Source[] = [];
	let loading = false;
	let isModalOpen = false;
	let isDeleteModalOpen = false;
	let isDetailModalOpen = false;
	let editingSource: Source | null = null;
	let deletingSource: Source | null = null;
	let viewingSource: Source | null = null;
	let currentPage = 1;
	let totalPages = 1;
	let totalItems = 0;
	const itemsPerPage = 10;

	// Form data
	let formData = {
		title: '',
		url: '',
		description: '',
		active: true,
		approved: false
	};

	const columns = [
		{ key: 'title', label: 'Kaynak Adi' },
		{ key: 'groupName', label: 'Grup' },
		{ key: 'tgUsername', label: 'Ekleyen' },
		{ key: 'approved', label: 'Onayli' },
		{ key: 'createdAt', label: 'Tarih' }
	];

	onMount(() => {
		loadSources();
	});

	async function loadSources() {
		loading = true;
		try {
			const response = await getData<Source>(
				'sources',
				false,
				itemsPerPage,
				currentPage,
				undefined,
				{ all: 'true' }
			);
			sources = response.data || [];
			totalItems = (response.meta as any)?.total || sources.length;
			totalPages = Math.ceil(totalItems / itemsPerPage);
		} catch (error) {
			toastStore.add('error', 'Kaynaklar yuklenirken hata olustu');
		} finally {
			loading = false;
		}
	}

	function openAddModal() {
		editingSource = null;
		formData = {
			title: '',
			url: '',
			description: '',
			active: true,
			approved: false
		};
		isModalOpen = true;
	}

	function openEditModal(source: Source) {
		editingSource = source;
		formData = {
			title: source.title,
			url: source.url,
			description: source.description || '',
			active: source.active,
			approved: source.approved
		};
		isModalOpen = true;
	}

	function openDetailModal(source: Source) {
		viewingSource = source;
		isDetailModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		editingSource = null;
	}

	function closeDetailModal() {
		isDetailModalOpen = false;
		viewingSource = null;
	}

	function openDeleteModal(source: Source) {
		deletingSource = source;
		isDeleteModalOpen = true;
	}

	function closeDeleteModal() {
		isDeleteModalOpen = false;
		deletingSource = null;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;

		try {
			const payload = {
				title: formData.title,
				url: formData.url,
				description: formData.description || undefined,
				active: formData.active,
				approved: formData.approved
			};
			if (editingSource) {
				const result = await updateData('sources', editingSource.id, payload);
				if (result.success) {
					toastStore.add('success', 'Kaynak basariyla guncellendi');
					closeModal();
					await loadSources();
				} else {
					toastStore.add('error', result.message || 'Guncelleme basarisiz');
				}
			} else {
				const result = await addData('sources', payload);
				if (result.success) {
					toastStore.add('success', 'Kaynak basariyla eklendi');
					closeModal();
					await loadSources();
				} else {
					toastStore.add('error', result.message || 'Ekleme basarisiz');
				}
			}
		} catch (error) {
			toastStore.add('error', 'Islem sirasinda hata olustu');
		} finally {
			loading = false;
		}
	}

	async function handleDelete() {
		if (!deletingSource) return;

		loading = true;
		try {
			const result = await deleteData('sources', String(deletingSource.id));
			if (result.success) {
				toastStore.add('success', 'Kaynak basariyla silindi');
				closeDeleteModal();
				await loadSources();
			} else {
				toastStore.add('error', result.message || 'Silme basarisiz');
			}
		} catch (error) {
			toastStore.add('error', 'Silme sirasinda hata olustu');
		} finally {
			loading = false;
		}
	}

	async function quickApprove(source: Source) {
		loading = true;
		try {
			const result = await updateData('sources', source.id, { approved: true });
			if (result.success) {
				toastStore.add('success', 'Kaynak onaylandi');
				await loadSources();
			} else {
				toastStore.add('error', result.message || 'Onaylama basarisiz');
			}
		} catch (error) {
			toastStore.add('error', 'Onaylama sirasinda hata olustu');
		} finally {
			loading = false;
		}
	}

	function handlePageChange(page: number) {
		currentPage = page;
		loadSources();
	}

	// Count pending approvals
	$: pendingCount = sources.filter((s) => !s.approved).length;
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<AdminLayout>
	<div class="space-y-6">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Kaynak Yonetimi</h1>
				{#if pendingCount > 0}
					<span
						class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
					>
						{pendingCount} onay bekliyor
					</span>
				{/if}
			</div>
			<Button variant="primary" on:click={openAddModal}>
				<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
				Yeni Kaynak
			</Button>
		</div>

		<div
			class="bg-white dark:bg-DarkerGrey shadow-sm border border-gray-200 dark:border-DarkLightGrey rounded-lg overflow-hidden"
		>
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200 dark:divide-DarkLightGrey">
					<thead class="bg-gray-50 dark:bg-DarkGrey">
						<tr>
							{#each columns as column}
								<th
									class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
								>
									{column.label}
								</th>
							{/each}
							<th
								class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
							>
								Islemler
							</th>
						</tr>
					</thead>
					<tbody class="bg-white dark:bg-DarkerGrey divide-y divide-gray-200 dark:divide-DarkLightGrey">
						{#if loading}
							<tr>
								<td colspan={columns.length + 1} class="px-6 py-4 text-center text-gray-500">
									Yukleniyor...
								</td>
							</tr>
						{:else if sources.length === 0}
							<tr>
								<td colspan={columns.length + 1} class="px-6 py-4 text-center text-gray-500">
									Kaynak bulunamadi
								</td>
							</tr>
						{:else}
							{#each sources as source}
								<tr
									class="hover:bg-gray-50 dark:hover:bg-DarkGrey cursor-pointer"
									class:bg-yellow-50={!source.approved}
									class:dark:bg-yellow-900={!source.approved}
									on:click={() => openDetailModal(source)}
								>
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="text-sm font-medium text-gray-900 dark:text-white">
											{source.title.length > 40 ? source.title.substring(0, 40) + '...' : source.title}
										</div>
										<div class="text-xs text-gray-500 dark:text-gray-400">
											{source.url.length > 50 ? source.url.substring(0, 50) + '...' : source.url}
										</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
										{source.groupName || '-'}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
										{source.tgUsername ? `@${source.tgUsername}` : source.tgUser || '-'}
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										{#if source.approved}
											<span
												class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
											>
												Onayli
											</span>
										{:else}
											<span
												class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
											>
												Beklemede
											</span>
										{/if}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
										{new Date(source.createdAt).toLocaleDateString('tr-TR')}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<div class="flex items-center justify-end gap-2" on:click|stopPropagation>
											{#if !source.approved}
												<button
													type="button"
													class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
													title="Onayla"
													on:click={() => quickApprove(source)}
												>
													<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
													</svg>
												</button>
											{/if}
											<button
												type="button"
												class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
												title="Duzenle"
												on:click={() => openEditModal(source)}
											>
												<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
												</svg>
											</button>
											<button
												type="button"
												class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
												title="Sil"
												on:click={() => openDeleteModal(source)}
											>
												<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
												</svg>
											</button>
										</div>
									</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>
			{#if sources.length > 0}
				<Pagination
					{currentPage}
					{totalPages}
					{totalItems}
					{itemsPerPage}
					onPageChange={handlePageChange}
				/>
			{/if}
		</div>
	</div>

	<!-- Detail Modal -->
	<Modal isOpen={isDetailModalOpen} title="Kaynak Detayi" onClose={closeDetailModal} size="lg">
		{#if viewingSource}
			<div class="space-y-4">
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Kaynak Adi</label>
						<p class="mt-1 text-sm text-gray-900 dark:text-white">{viewingSource.title}</p>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Durum</label>
						<p class="mt-1">
							{#if viewingSource.approved}
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Onayli</span>
							{:else}
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Onay Bekliyor</span>
							{/if}
						</p>
					</div>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-500 dark:text-gray-400">URL</label>
					<a href={viewingSource.url} target="_blank" rel="noopener noreferrer" class="mt-1 text-sm text-blue-600 hover:underline break-all">
						{viewingSource.url}
					</a>
				</div>

				{#if viewingSource.description}
					<div>
						<label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Aciklama</label>
						<p class="mt-1 text-sm text-gray-900 dark:text-white">{viewingSource.description}</p>
					</div>
				{/if}

				{#if viewingSource.tags && viewingSource.tags.length > 0}
					<div>
						<label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Etiketler</label>
						<div class="mt-1 flex flex-wrap gap-2">
							{#each viewingSource.tags as tag}
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
									#{tag.name}
								</span>
							{/each}
						</div>
					</div>
				{/if}

				<div class="border-t border-gray-200 dark:border-DarkLightGrey pt-4">
					<h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Telegram Bilgileri</h4>
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="block text-xs text-gray-400">Grup</label>
							<p class="text-sm text-gray-900 dark:text-white">{viewingSource.groupName || '-'}</p>
						</div>
						<div>
							<label class="block text-xs text-gray-400">Ekleyen</label>
							<p class="text-sm text-gray-900 dark:text-white">
								{viewingSource.tgUsername ? `@${viewingSource.tgUsername}` : viewingSource.tgUser || '-'}
							</p>
						</div>
						<div>
							<label class="block text-xs text-gray-400">Grup ID</label>
							<p class="text-sm text-gray-500">{viewingSource.tgChannel || '-'}</p>
						</div>
						<div>
							<label class="block text-xs text-gray-400">Kullanici ID</label>
							<p class="text-sm text-gray-500">{viewingSource.tgUser || '-'}</p>
						</div>
					</div>
				</div>

				<div class="border-t border-gray-200 dark:border-DarkLightGrey pt-4">
					<div class="grid grid-cols-2 gap-4 text-xs text-gray-500">
						<div>Olusturulma: {new Date(viewingSource.createdAt).toLocaleString('tr-TR')}</div>
						<div>Guncelleme: {new Date(viewingSource.updatedAt).toLocaleString('tr-TR')}</div>
					</div>
				</div>

				<div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-DarkLightGrey">
					{#if !viewingSource.approved}
						<Button type="button" variant="primary" on:click={() => { quickApprove(viewingSource); closeDetailModal(); }}>
							Onayla
						</Button>
					{/if}
					<Button type="button" variant="secondary" on:click={() => { openEditModal(viewingSource); closeDetailModal(); }}>
						Duzenle
					</Button>
					<Button type="button" variant="danger" on:click={() => { openDeleteModal(viewingSource); closeDetailModal(); }}>
						Sil
					</Button>
				</div>
			</div>
		{/if}
	</Modal>

	<!-- Add/Edit Modal -->
	<Modal
		isOpen={isModalOpen}
		title={editingSource ? 'Kaynak Duzenle' : 'Yeni Kaynak Ekle'}
		onClose={closeModal}
		size="lg"
	>
		<form on:submit={handleSubmit} class="space-y-4">
			<Input
				type="text"
				name="title"
				label="Kaynak Adi"
				bind:value={formData.title}
				required
				placeholder="GitHub, Stack Overflow, vb."
			/>

			<Input
				type="url"
				name="url"
				label="URL"
				bind:value={formData.url}
				required
				placeholder="https://example.com"
			/>

			<Input
				type="textarea"
				name="description"
				label="Aciklama"
				bind:value={formData.description}
				placeholder="Kaynak aciklamasi"
				rows={3}
			/>

			<Input
				type="checkbox"
				name="active"
				label="Aktif"
				bind:value={formData.active}
				placeholder="Kaynagi aktif et"
			/>

			<Input
				type="checkbox"
				name="approved"
				label="Onayli"
				bind:value={formData.approved}
				placeholder="Kaynagi onayla"
			/>

			<div
				class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-DarkLightGrey"
			>
				<Button type="button" variant="secondary" on:click={closeModal}>Iptal</Button>
				<Button type="submit" variant="primary" {loading}>
					{editingSource ? 'Guncelle' : 'Ekle'}
				</Button>
			</div>
		</form>
	</Modal>

	<!-- Delete Confirmation Modal -->
	<Modal isOpen={isDeleteModalOpen} title="Kaynagi Sil" onClose={closeDeleteModal} size="sm">
		<div class="space-y-4">
			<p class="text-sm text-gray-600 dark:text-gray-300">
				<strong>{deletingSource?.title}</strong> kaynagini silmek istediginizden emin misiniz? Bu
				islem geri alinamaz.
			</p>
			<div
				class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-DarkLightGrey"
			>
				<Button type="button" variant="secondary" on:click={closeDeleteModal}>Iptal</Button>
				<Button type="button" variant="danger" on:click={handleDelete} {loading}>Sil</Button>
			</div>
		</div>
	</Modal>
</AdminLayout>
