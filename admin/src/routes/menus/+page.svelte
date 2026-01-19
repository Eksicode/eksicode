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

	const pageTitle = 'Menü Yönetimi | Admin Panel';

	interface Menu {
		id: string;
		name: string;
		slug: string;
		url: string;
		order: number;
		isActive: boolean;
		parentId?: string;
		categoryId?: string;
		createdAt: string;
		updatedAt: string;
	}

	let menus: Menu[] = [];
	let loading = false;
	let isModalOpen = false;
	let isDeleteModalOpen = false;
	let editingMenu: Menu | null = null;
	let deletingMenu: Menu | null = null;
	let currentPage = 1;
	let totalPages = 1;
	let totalItems = 0;
	const itemsPerPage = 10;

	// Form data
	let formData = {
		name: '',
		slug: '',
		url: '',
		order: 0,
		isActive: true,
		parentId: '',
		categoryId: ''
	};

	const columns = [
		{ key: 'name', label: 'Menü Adı' },
		{ key: 'slug', label: 'Slug' },
		{ key: 'url', label: 'URL' },
		{ key: 'order', label: 'Sıra' },
		{ key: 'isActive', label: 'Aktif' },
		{ key: 'createdAt', label: 'Oluşturulma' }
	];

	onMount(() => {
		loadMenus();
	});

	async function loadMenus() {
		loading = true;
		try {
			const response = await getData<Menu>('menus', false, itemsPerPage, currentPage);
			menus = response.data || [];
			totalItems = (response.meta as any)?.total || menus.length;
			totalPages = Math.ceil(totalItems / itemsPerPage);
		} catch (error) {
			toastStore.add('error', 'Menüler yüklenirken hata oluştu');
		} finally {
			loading = false;
		}
	}

	function openAddModal() {
		editingMenu = null;
		formData = {
			name: '',
			slug: '',
			url: '',
			order: 0,
			isActive: true,
			parentId: '',
			categoryId: ''
		};
		isModalOpen = true;
	}

	function openEditModal(menu: Menu) {
		editingMenu = menu;
		formData = {
			name: menu.name,
			slug: menu.slug,
			url: menu.url,
			order: menu.order,
			isActive: menu.isActive,
			parentId: menu.parentId || '',
			categoryId: menu.categoryId || ''
		};
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		editingMenu = null;
	}

	function openDeleteModal(menu: Menu) {
		deletingMenu = menu;
		isDeleteModalOpen = true;
	}

	function closeDeleteModal() {
		isDeleteModalOpen = false;
		deletingMenu = null;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;

		try {
			const data: any = { ...formData };
			// Remove empty optional fields
			if (!data.parentId) delete data.parentId;
			if (!data.categoryId) delete data.categoryId;

			if (editingMenu) {
				const result = await updateData('menus', editingMenu.id, data);
				if (result.success) {
					toastStore.add('success', 'Menü başarıyla güncellendi');
					closeModal();
					await loadMenus();
				} else {
					toastStore.add('error', result.message || 'Güncelleme başarısız');
				}
			} else {
				const result = await addData('menus', data);
				if (result.success) {
					toastStore.add('success', 'Menü başarıyla eklendi');
					closeModal();
					await loadMenus();
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
		if (!deletingMenu) return;

		loading = true;
		try {
			const result = await deleteData('menus', deletingMenu.id);
			if (result.success) {
				toastStore.add('success', 'Menü başarıyla silindi');
				closeDeleteModal();
				await loadMenus();
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
		loadMenus();
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
			<h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Menü Yönetimi</h1>
			<Button variant="primary" on:click={openAddModal}>
				<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
				Yeni Menü
			</Button>
		</div>

		<div
			class="bg-white dark:bg-DarkerGrey shadow-sm border border-gray-200 dark:border-DarkLightGrey rounded-lg overflow-hidden"
		>
			<Table {columns} data={menus} {loading} onEdit={openEditModal} onDelete={openDeleteModal} />
			{#if menus.length > 0}
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
		title={editingMenu ? 'Menü Düzenle' : 'Yeni Menü Ekle'}
		onClose={closeModal}
		size="lg"
	>
		<form on:submit={handleSubmit} class="space-y-4">
			<Input
				type="text"
				name="name"
				label="Menü Adı"
				bind:value={formData.name}
				required
				placeholder="Ana Sayfa, Hakkımızda, vb."
				on:blur={generateSlug}
			/>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Input
					type="text"
					name="slug"
					label="Slug"
					bind:value={formData.slug}
					required
					placeholder="ana-sayfa"
				/>
				<div class="flex items-end">
					<Button type="button" variant="secondary" on:click={generateSlug} fullWidth>
						Slug Oluştur
					</Button>
				</div>
			</div>

			<Input
				type="text"
				name="url"
				label="URL"
				bind:value={formData.url}
				required
				placeholder="/home, /about, https://example.com"
			/>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Input
					type="number"
					name="order"
					label="Sıra"
					bind:value={formData.order}
					required
					placeholder="0"
				/>
				<div class="flex items-end">
					<Input
						type="checkbox"
						name="isActive"
						label=""
						bind:value={formData.isActive}
						placeholder="Menüyü aktif et"
					/>
				</div>
			</div>

			<div class="bg-gray-50 dark:bg-DarkLightGrey p-4 rounded-md">
				<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
					İleri Düzey Ayarlar (Opsiyonel)
				</h4>
				<div class="space-y-4">
					<Input
						type="text"
						name="parentId"
						label="Üst Menü ID"
						bind:value={formData.parentId}
						placeholder="Alt menü için üst menünün ID'si"
					/>
					<Input
						type="text"
						name="categoryId"
						label="Kategori ID"
						bind:value={formData.categoryId}
						placeholder="İlişkili kategori ID"
					/>
				</div>
			</div>

			<div
				class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-DarkLightGrey"
			>
				<Button type="button" variant="secondary" on:click={closeModal}>İptal</Button>
				<Button type="submit" variant="primary" {loading}>
					{editingMenu ? 'Güncelle' : 'Ekle'}
				</Button>
			</div>
		</form>
	</Modal>

	<!-- Delete Confirmation Modal -->
	<Modal isOpen={isDeleteModalOpen} title="Menüyü Sil" onClose={closeDeleteModal} size="sm">
		<div class="space-y-4">
			<p class="text-sm text-gray-600 dark:text-gray-300">
				<strong>{deletingMenu?.name}</strong> menüsünü silmek istediğinizden emin misiniz? Bu işlem
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
