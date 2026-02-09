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

	// Backend Menu model: id, name, link, subMenu, icon, active, order, categories[], createdAt, updatedAt
	interface MenuCategory {
		id: number;
		name: string;
	}
	interface Menu {
		id: number;
		name: string;
		link: string;
		subMenu: number;
		icon?: string | null;
		active: boolean;
		order: number;
		categories?: MenuCategory[];
		createdAt: string;
		updatedAt: string;
	}

	let menus: Menu[] = [];
	let menuCategories: MenuCategory[] = [];
	let loading = false;
	let isModalOpen = false;
	let isDeleteModalOpen = false;
	let editingMenu: Menu | null = null;
	let deletingMenu: Menu | null = null;
	let currentPage = 1;
	let totalPages = 1;
	let totalItems = 0;
	const itemsPerPage = 10;

	// Form data (backend field names)
	let formData = {
		name: '',
		link: '',
		order: 0,
		active: true,
		subMenu: 0,
		icon: '',
		categoryIds: [] as number[]
	};

	const columns = [
		{ key: 'name', label: 'Menü Adı' },
		{ key: 'link', label: 'URL' },
		{ key: 'order', label: 'Sıra' },
		{ key: 'active', label: 'Aktif' },
		{ key: 'createdAt', label: 'Oluşturulma' }
	];

	onMount(() => {
		loadMenus();
		loadMenuCategories();
	});

	async function loadMenus() {
		loading = true;
		try {
			const response = await getData<Menu>('menus', false, itemsPerPage, currentPage);
			menus = response.data || [];
			totalItems = (response.meta as any)?.total ?? menus.length;
			totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
		} catch (error) {
			toastStore.add('error', 'Menüler yüklenirken hata oluştu');
		} finally {
			loading = false;
		}
	}

	async function loadMenuCategories() {
		try {
			const response = await getData<MenuCategory>('menu-categories', false, 100, 1);
			menuCategories = response.data || [];
		} catch {
			menuCategories = [];
		}
	}

	function openAddModal() {
		editingMenu = null;
		formData = {
			name: '',
			link: '',
			order: 0,
			active: true,
			subMenu: 0,
			icon: '',
			categoryIds: []
		};
		isModalOpen = true;
	}

	function openEditModal(menu: Menu) {
		editingMenu = menu;
		formData = {
			name: menu.name,
			link: menu.link,
			order: menu.order,
			active: menu.active,
			subMenu: menu.subMenu ?? 0,
			icon: menu.icon || '',
			categoryIds: menu.categories?.map((c) => c.id) ?? []
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

	function toggleCategory(id: number) {
		const idx = formData.categoryIds.indexOf(id);
		if (idx === -1) {
			formData.categoryIds = [...formData.categoryIds, id];
		} else {
			formData.categoryIds = formData.categoryIds.filter((x) => x !== id);
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;

		try {
			const payload = {
				name: formData.name.trim(),
				link: formData.link.trim(),
				order: Number(formData.order) || 0,
				active: formData.active,
				subMenu: Number(formData.subMenu) || 0,
				icon: formData.icon.trim() || null,
				categoryIds: formData.categoryIds
			};

			if (editingMenu) {
				const result = await updateData('menus', editingMenu.id, payload);
				if (result.success) {
					toastStore.add('success', 'Menü başarıyla güncellendi');
					closeModal();
					await loadMenus();
				} else {
					toastStore.add('error', result.message || 'Güncelleme başarısız');
				}
			} else {
				const result = await addData('menus', payload);
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
			/>

			<Input
				type="text"
				name="link"
				label="URL"
				bind:value={formData.link}
				required
				placeholder="/, /etiketler, /kariyer"
			/>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Input
					type="number"
					name="order"
					label="Sıra"
					bind:value={formData.order}
					placeholder="0"
				/>
				<div class="flex items-end pb-1">
					<label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
						<input
							type="checkbox"
							bind:checked={formData.active}
							class="rounded border-gray-300 dark:border-DarkLightGrey"
						/>
						Aktif
					</label>
				</div>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Input
					type="number"
					name="subMenu"
					label="Üst Menü ID (0 = ana menü)"
					bind:value={formData.subMenu}
					placeholder="0"
				/>
				<Input
					type="text"
					name="icon"
					label="İkon (opsiyonel)"
					bind:value={formData.icon}
					placeholder="AiOutlineHome"
				/>
			</div>

			{#if menuCategories.length > 0}
				<div class="bg-gray-50 dark:bg-DarkLightGrey p-4 rounded-md">
					<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Kategoriler</h4>
					<div class="flex flex-wrap gap-2">
						{#each menuCategories as cat}
							<label
								class="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-gray-300 dark:border-DarkLightGrey cursor-pointer"
							>
								<input
									type="checkbox"
									checked={formData.categoryIds.includes(cat.id)}
									on:change={() => toggleCategory(cat.id)}
									class="rounded"
								/>
								<span class="text-sm">{cat.name}</span>
							</label>
						{/each}
					</div>
				</div>
			{/if}

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
