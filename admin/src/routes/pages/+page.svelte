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

	const pageTitle = 'Sayfa Yönetimi | Admin Panel';

	interface Page {
		id: string;
		title: string;
		slug: string;
		content: string;
		metaDescription?: string;
		isPublished: boolean;
		createdAt: string;
		updatedAt: string;
	}

	let pages: Page[] = [];
	let loading = false;
	let isModalOpen = false;
	let isDeleteModalOpen = false;
	let editingPage: Page | null = null;
	let deletingPage: Page | null = null;
	let currentPage = 1;
	let totalPages = 1;
	let totalItems = 0;
	const itemsPerPage = 10;

	// Form data
	let formData = {
		title: '',
		slug: '',
		content: '',
		metaDescription: '',
		isPublished: false
	};

	const columns = [
		{ key: 'title', label: 'Başlık' },
		{ key: 'slug', label: 'Slug' },
		{ key: 'isPublished', label: 'Yayında' },
		{ key: 'createdAt', label: 'Oluşturulma' },
		{ key: 'updatedAt', label: 'Güncellenme' }
	];

	onMount(() => {
		loadPages();
	});

	async function loadPages() {
		loading = true;
		try {
			const response = await getData<Page>('pages', false, itemsPerPage, currentPage);
			pages = response.data || [];
			totalItems = (response.meta as any)?.total || pages.length;
			totalPages = Math.ceil(totalItems / itemsPerPage);
		} catch (error) {
			toastStore.add('error', 'Sayfalar yüklenirken hata oluştu');
		} finally {
			loading = false;
		}
	}

	function openAddModal() {
		editingPage = null;
		formData = {
			title: '',
			slug: '',
			content: '',
			metaDescription: '',
			isPublished: false
		};
		isModalOpen = true;
	}

	function openEditModal(page: Page) {
		editingPage = page;
		formData = {
			title: page.title,
			slug: page.slug,
			content: page.content,
			metaDescription: page.metaDescription || '',
			isPublished: page.isPublished
		};
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		editingPage = null;
	}

	function openDeleteModal(page: Page) {
		deletingPage = page;
		isDeleteModalOpen = true;
	}

	function closeDeleteModal() {
		isDeleteModalOpen = false;
		deletingPage = null;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;

		try {
			if (editingPage) {
				const result = await updateData('pages', editingPage.id, formData);
				if (result.success) {
					toastStore.add('success', 'Sayfa başarıyla güncellendi');
					closeModal();
					await loadPages();
				} else {
					toastStore.add('error', result.message || 'Güncelleme başarısız');
				}
			} else {
				const result = await addData('pages', formData);
				if (result.success) {
					toastStore.add('success', 'Sayfa başarıyla eklendi');
					closeModal();
					await loadPages();
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
		if (!deletingPage) return;

		loading = true;
		try {
			const result = await deleteData('pages', deletingPage.id);
			if (result.success) {
				toastStore.add('success', 'Sayfa başarıyla silindi');
				closeDeleteModal();
				await loadPages();
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
		loadPages();
	}

	function generateSlug() {
		if (formData.title) {
			formData.slug = formData.title
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
			<h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Sayfa Yönetimi</h1>
			<Button variant="primary" on:click={openAddModal}>
				<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
				Yeni Sayfa
			</Button>
		</div>

		<div
			class="bg-white dark:bg-DarkerGrey shadow-sm border border-gray-200 dark:border-DarkLightGrey rounded-lg overflow-hidden"
		>
			<Table {columns} data={pages} {loading} onEdit={openEditModal} onDelete={openDeleteModal} />
			{#if pages.length > 0}
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
		title={editingPage ? 'Sayfa Düzenle' : 'Yeni Sayfa Ekle'}
		onClose={closeModal}
		size="xl"
	>
		<form on:submit={handleSubmit} class="space-y-4">
			<Input
				type="text"
				name="title"
				label="Başlık"
				bind:value={formData.title}
				required
				placeholder="Sayfa başlığı"
				on:blur={generateSlug}
			/>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Input
					type="text"
					name="slug"
					label="Slug"
					bind:value={formData.slug}
					required
					placeholder="sayfa-slug"
				/>
				<div class="flex items-end">
					<Button type="button" variant="secondary" on:click={generateSlug} fullWidth>
						Slug Oluştur
					</Button>
				</div>
			</div>

			<Input
				type="textarea"
				name="content"
				label="İçerik"
				bind:value={formData.content}
				required
				placeholder="Sayfa içeriği"
				rows={10}
			/>

			<Input
				type="textarea"
				name="metaDescription"
				label="Meta Açıklama"
				bind:value={formData.metaDescription}
				placeholder="SEO için meta açıklama"
				rows={3}
			/>

			<Input
				type="checkbox"
				name="isPublished"
				label=""
				bind:value={formData.isPublished}
				placeholder="Sayfayı yayınla"
			/>

			<div
				class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-DarkLightGrey"
			>
				<Button type="button" variant="secondary" on:click={closeModal}>İptal</Button>
				<Button type="submit" variant="primary" {loading}>
					{editingPage ? 'Güncelle' : 'Ekle'}
				</Button>
			</div>
		</form>
	</Modal>

	<!-- Delete Confirmation Modal -->
	<Modal isOpen={isDeleteModalOpen} title="Sayfayı Sil" onClose={closeDeleteModal} size="sm">
		<div class="space-y-4">
			<p class="text-sm text-gray-600 dark:text-gray-300">
				<strong>{deletingPage?.title}</strong> sayfasını silmek istediğinizden emin misiniz? Bu işlem
				geri alınamaz.
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
