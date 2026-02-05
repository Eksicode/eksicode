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

	const pageTitle = 'Kaynak Yönetimi | Admin Panel';

	interface Source {
		id: number;
		title: string;
		url: string;
		description?: string | null;
		active: boolean;
		approved: boolean;
		tgChannel?: string | null;
		tgUser?: string | null;
		tags?: { name: string }[];
		createdAt: string;
		updatedAt: string;
	}

	let sources: Source[] = [];
	let loading = false;
	let isModalOpen = false;
	let isDeleteModalOpen = false;
	let editingSource: Source | null = null;
	let deletingSource: Source | null = null;
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
		{ key: 'title', label: 'Kaynak Adı' },
		{ key: 'url', label: 'URL' },
		{ key: 'active', label: 'Aktif' },
		{ key: 'approved', label: 'Onaylı' },
		{ key: 'createdAt', label: 'Oluşturulma' }
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
			toastStore.add('error', 'Kaynaklar yüklenirken hata oluştu');
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

	function closeModal() {
		isModalOpen = false;
		editingSource = null;
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
					toastStore.add('success', 'Kaynak başarıyla güncellendi');
					closeModal();
					await loadSources();
				} else {
					toastStore.add('error', result.message || 'Güncelleme başarısız');
				}
			} else {
				const result = await addData('sources', payload);
				if (result.success) {
					toastStore.add('success', 'Kaynak başarıyla eklendi');
					closeModal();
					await loadSources();
				} else {
					toastStore.add('error', result.message || 'Ekleme başarısız');
				}
			}
		} catch (error) {
			toastStore.add('error', 'İşlem sırasında hata oluştu');
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
				toastStore.add('success', 'Kaynak başarıyla silindi');
				closeDeleteModal();
				await loadSources();
			} else {
				toastStore.add('error', result.message || 'Silme başarısız');
			}
		} catch (error) {
			toastStore.add('error', 'Silme sırasında hata oluştu');
		} finally {
			loading = false;
		}
	}

	function handlePageChange(page: number) {
		currentPage = page;
		loadSources();
	}
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<AdminLayout>
	<div class="space-y-6">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Kaynak Yönetimi</h1>
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
			<Table
				{columns}
				data={sources}
				{loading}
				onEdit={openEditModal}
				onDelete={openDeleteModal}
			/>
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

	<!-- Add/Edit Modal -->
	<Modal
		isOpen={isModalOpen}
		title={editingSource ? 'Kaynak Düzenle' : 'Yeni Kaynak Ekle'}
		onClose={closeModal}
		size="lg"
	>
		<form on:submit={handleSubmit} class="space-y-4">
			<Input
				type="text"
				name="title"
				label="Kaynak Adı"
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
				label="Açıklama"
				bind:value={formData.description}
				placeholder="Kaynak açıklaması"
				rows={3}
			/>

			<Input
				type="checkbox"
				name="active"
				label="Aktif"
				bind:value={formData.active}
				placeholder="Kaynağı aktif et"
			/>

			<Input
				type="checkbox"
				name="approved"
				label="Onaylı"
				bind:value={formData.approved}
				placeholder="Kaynağı onayla"
			/>

			<div
				class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-DarkLightGrey"
			>
				<Button type="button" variant="secondary" on:click={closeModal}>İptal</Button>
				<Button type="submit" variant="primary" {loading}>
					{editingSource ? 'Güncelle' : 'Ekle'}
				</Button>
			</div>
		</form>
	</Modal>

	<!-- Delete Confirmation Modal -->
	<Modal isOpen={isDeleteModalOpen} title="Kaynağı Sil" onClose={closeDeleteModal} size="sm">
		<div class="space-y-4">
			<p class="text-sm text-gray-600 dark:text-gray-300">
				<strong>{deletingSource?.title}</strong> kaynağını silmek istediğinizden emin misiniz? Bu
				işlem geri alınamaz.
			</p>
			<div
				class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-DarkLightGrey"
			>
				<Button type="button" variant="secondary" on:click={closeDeleteModal}>İptal</Button>
				<Button type="button" variant="danger" on:click={handleDelete} {loading}>Sil</Button>
			</div>
		</div>
	</Modal>
</AdminLayout>
