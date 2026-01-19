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

	const pageTitle = 'Kullanıcı Yönetimi | Admin Panel';

	interface User {
		id: string;
		username: string;
		email: string;
		firstName?: string;
		lastName?: string;
		roles: string[];
		verified: boolean;
		createdAt: string;
	}

	let users: User[] = [];
	let loading = false;
	let isModalOpen = false;
	let isDeleteModalOpen = false;
	let editingUser: User | null = null;
	let deletingUser: User | null = null;
	let currentPage = 1;
	let totalPages = 1;
	let totalItems = 0;
	const itemsPerPage = 10;

	// Form data
	let formData = {
		username: '',
		email: '',
		password: '',
		firstName: '',
		lastName: '',
		roles: [] as string[],
		verified: false
	};

	const columns = [
		{ key: 'username', label: 'Kullanıcı Adı' },
		{ key: 'email', label: 'E-posta' },
		{ key: 'firstName', label: 'Ad' },
		{ key: 'lastName', label: 'Soyad' },
		{ key: 'roles', label: 'Roller' },
		{ key: 'verified', label: 'Doğrulanmış' },
		{ key: 'createdAt', label: 'Kayıt Tarihi' }
	];

	const roleOptions = [
		{ value: 'user', label: 'Kullanıcı' },
		{ value: 'admin', label: 'Admin' },
		{ value: 'moderator', label: 'Moderator' },
		{ value: 'superadmin', label: 'Süper Admin' }
	];

	onMount(() => {
		loadUsers();
	});

	async function loadUsers() {
		loading = true;
		try {
			const response = await getData<User>('users', false, itemsPerPage, currentPage);
			users = response.data || [];
			totalItems = (response.meta as any)?.total || users.length;
			totalPages = Math.ceil(totalItems / itemsPerPage);
		} catch (error) {
			toastStore.add('error', 'Kullanıcılar yüklenirken hata oluştu');
		} finally {
			loading = false;
		}
	}

	function openAddModal() {
		editingUser = null;
		formData = {
			username: '',
			email: '',
			password: '',
			firstName: '',
			lastName: '',
			roles: [],
			verified: false
		};
		isModalOpen = true;
	}

	function openEditModal(user: User) {
		editingUser = user;
		formData = {
			username: user.username,
			email: user.email,
			password: '',
			firstName: user.firstName || '',
			lastName: user.lastName || '',
			roles: user.roles || [],
			verified: user.verified
		};
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		editingUser = null;
	}

	function openDeleteModal(user: User) {
		deletingUser = user;
		isDeleteModalOpen = true;
	}

	function closeDeleteModal() {
		isDeleteModalOpen = false;
		deletingUser = null;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;

		try {
			const data: any = { ...formData };
			if (!data.password && editingUser) {
				delete data.password;
			}

			if (editingUser) {
				const result = await updateData('users', editingUser.id, data);
				if (result.success) {
					toastStore.add('success', 'Kullanıcı başarıyla güncellendi');
					closeModal();
					await loadUsers();
				} else {
					toastStore.add('error', result.message || 'Güncelleme başarısız');
				}
			} else {
				const result = await addData('users', data);
				if (result.success) {
					toastStore.add('success', 'Kullanıcı başarıyla eklendi');
					closeModal();
					await loadUsers();
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
		if (!deletingUser) return;

		loading = true;
		try {
			const result = await deleteData('users', deletingUser.id);
			if (result.success) {
				toastStore.add('success', 'Kullanıcı başarıyla silindi');
				closeDeleteModal();
				await loadUsers();
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
		loadUsers();
	}

	function toggleRole(role: string) {
		if (formData.roles.includes(role)) {
			formData.roles = formData.roles.filter((r) => r !== role);
		} else {
			formData.roles = [...formData.roles, role];
		}
	}
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<AdminLayout>
	<div class="space-y-6">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Kullanıcı Yönetimi</h1>
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
				Yeni Kullanıcı
			</Button>
		</div>

		<div
			class="bg-white dark:bg-DarkerGrey shadow-sm border border-gray-200 dark:border-DarkLightGrey rounded-lg overflow-hidden"
		>
			<Table
				{columns}
				data={users}
				{loading}
				onEdit={openEditModal}
				onDelete={openDeleteModal}
			/>
			{#if users.length > 0}
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
		title={editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}
		onClose={closeModal}
		size="lg"
	>
		<form on:submit={handleSubmit} class="space-y-4">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Input
					type="text"
					name="username"
					label="Kullanıcı Adı"
					bind:value={formData.username}
					required
					placeholder="johndoe"
				/>
				<Input
					type="email"
					name="email"
					label="E-posta"
					bind:value={formData.email}
					required
					placeholder="john@example.com"
				/>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Input
					type="text"
					name="firstName"
					label="Ad"
					bind:value={formData.firstName}
					placeholder="John"
				/>
				<Input
					type="text"
					name="lastName"
					label="Soyad"
					bind:value={formData.lastName}
					placeholder="Doe"
				/>
			</div>

			<Input
				type="password"
				name="password"
				label={editingUser ? 'Şifre (boş bırakılırsa değişmez)' : 'Şifre'}
				bind:value={formData.password}
				required={!editingUser}
				placeholder="••••••••"
			/>

			<div>
				<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Roller
				</label>
				<div class="space-y-2">
					{#each roleOptions as role}
						<label class="flex items-center">
							<input
								type="checkbox"
								checked={formData.roles.includes(role.value)}
								on:change={() => toggleRole(role.value)}
								class="h-4 w-4 rounded border-gray-300 dark:border-DarkLightGrey text-blue-600 focus:ring-blue-500"
							/>
							<span class="ml-2 text-sm text-gray-900 dark:text-white">{role.label}</span>
						</label>
					{/each}
				</div>
			</div>

			<Input
				type="checkbox"
				name="verified"
				label=""
				bind:value={formData.verified}
				placeholder="E-posta doğrulanmış olarak işaretle"
			/>

			<div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-DarkLightGrey">
				<Button type="button" variant="secondary" on:click={closeModal}>İptal</Button>
				<Button type="submit" variant="primary" {loading}>
					{editingUser ? 'Güncelle' : 'Ekle'}
				</Button>
			</div>
		</form>
	</Modal>

	<!-- Delete Confirmation Modal -->
	<Modal
		isOpen={isDeleteModalOpen}
		title="Kullanıcıyı Sil"
		onClose={closeDeleteModal}
		size="sm"
	>
		<div class="space-y-4">
			<p class="text-sm text-gray-600 dark:text-gray-300">
				<strong>{deletingUser?.username}</strong> kullanıcısını silmek istediğinizden emin misiniz?
				Bu işlem geri alınamaz.
			</p>
			<div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-DarkLightGrey">
				<Button type="button" variant="secondary" on:click={closeDeleteModal}>İptal</Button>
				<Button type="button" variant="danger" on:click={handleDelete} {loading}>Sil</Button>
			</div>
		</div>
	</Modal>
</AdminLayout>
