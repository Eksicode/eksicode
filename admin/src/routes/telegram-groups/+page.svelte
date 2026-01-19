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

	const pageTitle = 'Telegram Grupları Yönetimi | Admin Panel';

	interface TelegramGroup {
		id: string;
		name: string;
		icon?: string;
		members: number;
		link: string;
		channelId?: string;
		listOrder?: number;
		description?: string;
		active: boolean;
		createdAt: string;
		updatedAt: string;
	}

	let telegramGroups: TelegramGroup[] = [];
	let loading = false;
	let isModalOpen = false;
	let isDeleteModalOpen = false;
	let editingGroup: TelegramGroup | null = null;
	let deletingGroup: TelegramGroup | null = null;
	let currentPage = 1;
	let totalPages = 1;
	let totalItems = 0;
	const itemsPerPage = 10;

	// Form data
	let formData = {
		name: '',
		icon: '',
		members: 0,
		link: '',
		channelId: '',
		listOrder: 0,
		description: '',
		active: true
	};

	const columns = [
		{ key: 'name', label: 'Grup Adı' },
		{ key: 'members', label: 'Üye Sayısı' },
		{ key: 'channelId', label: 'Kanal ID' },
		{ key: 'listOrder', label: 'Sıra' },
		{ key: 'active', label: 'Aktif' },
		{ key: 'createdAt', label: 'Oluşturulma Tarihi' }
	];

	onMount(() => {
		loadTelegramGroups();
	});

	async function loadTelegramGroups() {
		loading = true;
		try {
			const response = await getData<TelegramGroup>('telegrams', false, itemsPerPage, currentPage);
			telegramGroups = response.data || [];
			totalItems = (response.meta as any)?.total || telegramGroups.length;
			totalPages = Math.ceil(totalItems / itemsPerPage);
		} catch (error) {
			toastStore.add('error', 'Telegram grupları yüklenirken hata oluştu');
		} finally {
			loading = false;
		}
	}

	function openAddModal() {
		editingGroup = null;
		formData = {
			name: '',
			icon: '',
			members: 0,
			link: '',
			channelId: '',
			listOrder: 0,
			description: '',
			active: true
		};
		isModalOpen = true;
	}

	function openEditModal(group: TelegramGroup) {
		editingGroup = group;
		formData = {
			name: group.name,
			icon: group.icon || '',
			members: group.members || 0,
			link: group.link,
			channelId: group.channelId || '',
			listOrder: group.listOrder || 0,
			description: group.description || '',
			active: group.active
		};
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		editingGroup = null;
	}

	function openDeleteModal(group: TelegramGroup) {
		deletingGroup = group;
		isDeleteModalOpen = true;
	}

	function closeDeleteModal() {
		isDeleteModalOpen = false;
		deletingGroup = null;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;

		try {
			const data: any = {
				...formData,
				members: parseInt(formData.members.toString()),
				listOrder: formData.listOrder ? parseInt(formData.listOrder.toString()) : null
			};

			// Remove empty optional fields
			if (!data.icon) delete data.icon;
			if (!data.channelId) delete data.channelId;
			if (!data.description) delete data.description;
			if (data.listOrder === null || data.listOrder === 0) delete data.listOrder;

			if (editingGroup) {
				const result = await updateData('telegrams', editingGroup.id, data);
				if (result.success) {
					toastStore.add('success', 'Telegram grubu başarıyla güncellendi');
					closeModal();
					await loadTelegramGroups();
				} else {
					toastStore.add('error', result.message || 'Güncelleme başarısız');
				}
			} else {
				const result = await addData('telegrams', data);
				if (result.success) {
					toastStore.add('success', 'Telegram grubu başarıyla eklendi');
					closeModal();
					await loadTelegramGroups();
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
		if (!deletingGroup) return;

		loading = true;
		try {
			const result = await deleteData('telegrams', deletingGroup.id);
			if (result.success) {
				toastStore.add('success', 'Telegram grubu başarıyla silindi');
				closeDeleteModal();
				await loadTelegramGroups();
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
		loadTelegramGroups();
	}
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<AdminLayout>
	<div class="space-y-6">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Telegram Grupları</h1>
			<Button variant="primary" on:click={openAddModal}>
				<svg
					class="w-5 h-5 mr-2"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
				Yeni Telegram Grubu
			</Button>
		</div>

		<div
			class="bg-white dark:bg-DarkerGrey shadow-sm border border-gray-200 dark:border-DarkLightGrey rounded-lg overflow-hidden"
		>
			<Table
				{columns}
				data={telegramGroups}
				{loading}
				onEdit={openEditModal}
				onDelete={openDeleteModal}
			/>
			{#if telegramGroups.length > 0}
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
		title={editingGroup ? 'Telegram Grubu Düzenle' : 'Yeni Telegram Grubu Ekle'}
		onClose={closeModal}
		size="lg"
	>
		<form on:submit={handleSubmit} class="space-y-4">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Input
					type="text"
					name="name"
					label="Grup Adı"
					bind:value={formData.name}
					required
					placeholder="EksiCode Genel"
				/>
				<Input
					type="text"
					name="channelId"
					label="Kanal ID"
					bind:value={formData.channelId}
					placeholder="-1001234567890"
				/>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Input
					type="number"
					name="members"
					label="Üye Sayısı"
					bind:value={formData.members}
					required
					placeholder="0"
				/>
				<Input
					type="number"
					name="listOrder"
					label="Sıra"
					bind:value={formData.listOrder}
					placeholder="0"
				/>
			</div>

			<Input
				type="url"
				name="link"
				label="Grup Linki"
				bind:value={formData.link}
				required
				placeholder="https://t.me/eksicode"
			/>

			<Input
				type="text"
				name="icon"
				label="İkon (emoji veya URL)"
				bind:value={formData.icon}
				placeholder="📱"
			/>

			<div>
				<label
					for="description"
					class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
				>
					Açıklama
				</label>
				<textarea
					id="description"
					name="description"
					bind:value={formData.description}
					rows="3"
					class="w-full px-3 py-2 border border-gray-300 dark:border-DarkLightGrey rounded-md shadow-sm bg-white dark:bg-DarkerGrey text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-eksiCode focus:border-transparent"
					placeholder="Grup hakkında kısa açıklama..."
				></textarea>
			</div>

			<div class="flex items-center">
				<input
					type="checkbox"
					id="active"
					name="active"
					bind:checked={formData.active}
					class="h-4 w-4 rounded border-gray-300 dark:border-DarkLightGrey text-blue-600 focus:ring-blue-500"
				/>
				<label for="active" class="ml-2 text-sm text-gray-900 dark:text-white">
					Aktif
				</label>
			</div>

			<div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-DarkLightGrey">
				<Button type="button" variant="secondary" on:click={closeModal}>İptal</Button>
				<Button type="submit" variant="primary" {loading}>
					{editingGroup ? 'Güncelle' : 'Ekle'}
				</Button>
			</div>
		</form>
	</Modal>

	<!-- Delete Confirmation Modal -->
	<Modal
		isOpen={isDeleteModalOpen}
		title="Telegram Grubunu Sil"
		onClose={closeDeleteModal}
		size="sm"
	>
		<div class="space-y-4">
			<p class="text-sm text-gray-600 dark:text-gray-300">
				<strong>{deletingGroup?.name}</strong> grubunu silmek istediğinizden emin misiniz?
				Bu işlem geri alınamaz.
			</p>
			<div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-DarkLightGrey">
				<Button type="button" variant="secondary" on:click={closeDeleteModal}>İptal</Button>
				<Button type="button" variant="danger" on:click={handleDelete} {loading}>Sil</Button>
			</div>
		</div>
	</Modal>
</AdminLayout>
