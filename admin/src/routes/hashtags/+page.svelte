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

	const pageTitle = 'Etiket Yönetimi | Admin Panel';

	interface Hashtag {
		id: string;
		name: string;
		slug: string;
		description?: string;
		isActive: boolean;
		postCount?: number;
		createdAt: string;
		updatedAt: string;
	}

	let hashtags: Hashtag[] = [];
	let loading = false;
	let isModalOpen = false;
	let isDeleteModalOpen = false;
	let editingHashtag: Hashtag | null = null;
	let deletingHashtag: Hashtag | null = null;
	let currentPage = 1;
	let totalPages = 1;
	let totalItems = 0;
	const itemsPerPage = 10;

	// Form data
	let formData = {
		name: '',
		slug: '',
		description: '',
		isActive: true
	};

	const columns = [
		{ key: 'name', label: 'Etiket Adı' },
		{ key: 'slug', label: 'Slug' },
		{ key: 'postCount', label: 'Gönderi Sayısı' },
		{ key: 'isActive', label: 'Aktif' },
		{ key: 'createdAt', label: 'Oluşturulma' }
	];

	onMount(() => {
		loadHashtags();
	});

	async function loadHashtags() {
		loading = true;
		try {
			const response = await getData<Hashtag>('hashtags', false, itemsPerPage, currentPage);
			hashtags = response.data || [];
			totalItems = (response.meta as any)?.total || hashtags.length;
			totalPages = Math.ceil(totalItems / itemsPerPage);
		} catch (error) {
			toastStore.add('error', 'Etiketler yüklenirken hata oluştu');
		} finally {
			loading = false;
		}
	}

	function openAddModal() {
		editingHashtag = null;
		formData = {
			name: '',
			slug: '',
			description: '',
			isActive: true
		};
		isModalOpen = true;
	}

	function openEditModal(hashtag: Hashtag) {
		editingHashtag = hashtag;
		formData = {
			name: hashtag.name,
			slug: hashtag.slug,
			description: hashtag.description || '',
			isActive: hashtag.isActive
		};
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		editingHashtag = null;
	}

	function openDeleteModal(hashtag: Hashtag) {
		deletingHashtag = hashtag;
		isDeleteModalOpen = true;
	}

	function closeDeleteModal() {
		isDeleteModalOpen = false;
		deletingHashtag = null;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;

		try {
			if (editingHashtag) {
				const result = await updateData('hashtags', editingHashtag.id, formData);
				if (result.success) {
					toastStore.add('success', 'Etiket başarıyla güncellendi');
					closeModal();
					await loadHashtags();
				} else {
					toastStore.add('error', result.message || 'Güncelleme başarısız');
				}
			} else {
				const result = await addData('hashtags', formData);
				if (result.success) {
					toastStore.add('success', 'Etiket başarıyla eklendi');
					closeModal();
					await loadHashtags();
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
		if (!deletingHashtag) return;

		loading = true;
		try {
			const result = await deleteData('hashtags', deletingHashtag.id);
			if (result.success) {
				toastStore.add('success', 'Etiket başarıyla silindi');
				closeDeleteModal();
				await loadHashtags();
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
		loadHashtags();
	}

	function generateSlug() {
		if (formData.name) {
			formData.slug = formData.name
				.toLowerCase()
				.replace(/ğ/g, 'g')
				.replace(/ü/g, 'u')
				.replace(/ş/g, 's')
				.replace(/ı/g, 'i')
				.replace(/ö/g, 'o')
				.replace(/ç/g, 'c')
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-+|-+$/g, '');
		}
	}
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<AdminLayout>
	<div class="space-y-6">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Etiket Yönetimi</h1>
			<Button variant="primary" on:click={openAddModal}>
				<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
				Yeni Etiket
			</Button>
		</div>

		<div
			class="bg-white dark:bg-DarkerGrey shadow-sm border border-gray-200 dark:border-DarkLightGrey rounded-lg overflow-hidden"
		>
			<Table
				{columns}
				data={hashtags}
				{loading}
				onEdit={openEditModal}
				onDelete={openDeleteModal}
			/>
			{#if hashtags.length > 0}
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
		title={editingHashtag ? 'Etiket Düzenle' : 'Yeni Etiket Ekle'}
		onClose={closeModal}
		size="lg"
	>
		<form on:submit={handleSubmit} class="space-y-4">
			<Input
				type="text"
				name="name"
				label="Etiket Adı"
				bind:value={formData.name}
				required
				placeholder="javascript, python, vb."
				on:blur={generateSlug}
			/>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Input
					type="text"
					name="slug"
					label="Slug"
					bind:value={formData.slug}
					required
					placeholder="javascript-python"
				/>
				<div class="flex items-end">
					<Button type="button" variant="secondary" on:click={generateSlug} fullWidth>
						Slug Oluştur
					</Button>
				</div>
			</div>

			<Input
				type="textarea"
				name="description"
				label="Açıklama"
				bind:value={formData.description}
				placeholder="Etiket açıklaması"
				rows={3}
			/>

			<Input
				type="checkbox"
				name="isActive"
				label=""
				bind:value={formData.isActive}
				placeholder="Etiketi aktif et"
			/>

			<div
				class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-DarkLightGrey"
			>
				<Button type="button" variant="secondary" on:click={closeModal}>İptal</Button>
				<Button type="submit" variant="primary" {loading}>
					{editingHashtag ? 'Güncelle' : 'Ekle'}
				</Button>
			</div>
		</form>
	</Modal>

	<!-- Delete Confirmation Modal -->
	<Modal isOpen={isDeleteModalOpen} title="Etiketi Sil" onClose={closeDeleteModal} size="sm">
		<div class="space-y-4">
			<p class="text-sm text-gray-600 dark:text-gray-300">
				<strong>{deletingHashtag?.name}</strong> etiketini silmek istediğinizden emin misiniz? Bu
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
