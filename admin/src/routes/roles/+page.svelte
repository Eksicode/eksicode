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
	import type { Role } from '$lib/api/types';
	import { PERMISSION_CATEGORIES } from '$lib/api/types';

	const pageTitle = 'Rol Yönetimi | Admin Panel';

	let roles: Role[] = [];
	let filteredRoles: Role[] = [];
	let loading = false;
	let loadError: string | null = null;
	let isModalOpen = false;
	let isDeleteModalOpen = false;
	let isViewModalOpen = false;
	let editingRole: Role | null = null;
	let deletingRole: Role | null = null;
	let viewingRole: Role | null = null;
	let currentPage = 1;
	let totalPages = 1;
	let totalItems = 0;
	const itemsPerPage = 10;

	// Search and filter
	let searchQuery = '';
	let filterActive = 'all'; // all, system, custom

	// Form data with validation
	let formData = {
		name: '',
		description: '',
		permissions: [] as string[]
	};

	let formErrors = {
		name: '',
		description: '',
		permissions: ''
	};

	// Track expanded categories in permission selector
	let expandedCategories = new Set<string>();

	const columns = [
		{ key: 'name', label: 'Rol Adı' },
		{ key: 'description', label: 'Açıklama' },
		{ key: 'userCount', label: 'Kullanıcı Sayısı' },
		{ key: 'permissions', label: 'İzin Sayısı' },
		{ key: 'createdAt', label: 'Oluşturulma' }
	];

	// Transform data for table display
	$: tableData = filteredRoles.map((role) => ({
		...role,
		permissions: role.permissions?.length || 0,
		userCount: role.userCount || 0
	}));

	// Filter roles based on search and filter criteria
	$: {
		let result = roles;

		// Apply search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(role) =>
					role.name.toLowerCase().includes(query) ||
					role.description?.toLowerCase().includes(query)
			);
		}

		// Apply type filter
		if (filterActive !== 'all') {
			result = result.filter((role) =>
				filterActive === 'system' ? role.isSystemRole : !role.isSystemRole
			);
		}

		filteredRoles = result;
	}

	onMount(() => {
		loadRoles();
		// Expand all categories by default
		PERMISSION_CATEGORIES.forEach((cat) => expandedCategories.add(cat.name));
		expandedCategories = expandedCategories;
	});

	async function loadRoles() {
		loading = true;
		loadError = null;
		try {
			const response = await getData<Role>('roles', false, itemsPerPage, currentPage);
			
			// Check if response indicates an error
			if (!response.data || (response.data as any).length === 0 && response.message) {
				// Check for permission error
				if (response.message.includes('403') || response.message.includes('Admin access required')) {
					loadError = 'Bu sayfayı görüntülemek için "admin.roles.view" iznine ihtiyacınız var. Lütfen sistem yöneticinizle iletişime geçin.';
					toastStore.add('error', 'Yetki hatası: Rol görüntüleme izniniz yok');
				} else {
					loadError = response.message || 'Roller yüklenirken bir hata oluştu';
					toastStore.add('error', 'Roller yüklenirken hata oluştu');
				}
				roles = [];
			} else {
				roles = response.data || [];
				totalItems = (response.meta as any)?.total || roles.length;
				totalPages = Math.ceil(totalItems / itemsPerPage);
			}
		} catch (error: any) {
			loadError = error.message || 'Bağlantı hatası oluştu';
			toastStore.add('error', 'Roller yüklenirken hata oluştu');
			roles = [];
		} finally {
			loading = false;
		}
	}

	function validateForm(): boolean {
		let isValid = true;
		formErrors = { name: '', description: '', permissions: '' };

		if (!formData.name.trim()) {
			formErrors.name = 'Rol adı zorunludur';
			isValid = false;
		} else if (formData.name.length < 2) {
			formErrors.name = 'Rol adı en az 2 karakter olmalıdır';
			isValid = false;
		} else if (!/^[a-zA-Z0-9_-]+$/.test(formData.name)) {
			formErrors.name = 'Rol adı sadece harf, rakam, tire ve alt çizgi içerebilir';
			isValid = false;
		}

		if (formData.permissions.length === 0) {
			formErrors.permissions = 'En az bir izin seçmelisiniz';
			isValid = false;
		}

		return isValid;
	}

	function openAddModal() {
		editingRole = null;
		formData = {
			name: '',
			description: '',
			permissions: []
		};
		formErrors = { name: '', description: '', permissions: '' };
		isModalOpen = true;
	}

	function openEditModal(role: Role) {
		editingRole = role;
		formData = {
			name: role.name,
			description: role.description || '',
			permissions: role.permissions || []
		};
		formErrors = { name: '', description: '', permissions: '' };
		isModalOpen = true;
	}

	function openViewModal(role: Role) {
		viewingRole = role;
		isViewModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		editingRole = null;
		formErrors = { name: '', description: '', permissions: '' };
	}

	function closeViewModal() {
		isViewModalOpen = false;
		viewingRole = null;
	}

	function openDeleteModal(role: Role) {
		deletingRole = role;
		isDeleteModalOpen = true;
	}

	function closeDeleteModal() {
		isDeleteModalOpen = false;
		deletingRole = null;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validateForm()) {
			toastStore.add('error', 'Lütfen form hatalarını düzeltin');
			return;
		}

		loading = true;

		try {
			if (editingRole) {
				const result = await updateData('roles', editingRole.id, formData);
				if (result.success) {
					toastStore.add('success', 'Rol başarıyla güncellendi');
					closeModal();
					await loadRoles();
				} else {
					toastStore.add('error', result.message || 'Güncelleme başarısız');
				}
			} else {
				const result = await addData('roles', formData);
				if (result.success) {
					toastStore.add('success', 'Rol başarıyla eklendi');
					closeModal();
					await loadRoles();
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
		if (!deletingRole) return;

		loading = true;
		try {
			const result = await deleteData('roles', deletingRole.id);
			if (result.success) {
				toastStore.add('success', 'Rol başarıyla silindi');
				closeDeleteModal();
				await loadRoles();
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
		loadRoles();
	}

	function togglePermission(permission: string) {
		if (formData.permissions.includes(permission)) {
			formData.permissions = formData.permissions.filter((p) => p !== permission);
		} else {
			formData.permissions = [...formData.permissions, permission];
		}
		// Clear permission error when user selects a permission
		if (formData.permissions.length > 0) {
			formErrors.permissions = '';
		}
	}

	function toggleCategory(categoryName: string) {
		if (expandedCategories.has(categoryName)) {
			expandedCategories.delete(categoryName);
		} else {
			expandedCategories.add(categoryName);
		}
		expandedCategories = expandedCategories;
	}

	function selectAllInCategory(category: typeof PERMISSION_CATEGORIES[0]) {
		const categoryPermissions = category.permissions.map((p) => p.key);
		const allSelected = categoryPermissions.every((p) => formData.permissions.includes(p));

		if (allSelected) {
			// Deselect all in category
			formData.permissions = formData.permissions.filter((p) => !categoryPermissions.includes(p));
		} else {
			// Select all in category
			const newPermissions = new Set([...formData.permissions, ...categoryPermissions]);
			formData.permissions = Array.from(newPermissions);
		}
	}

	function getCategoryProgress(category: typeof PERMISSION_CATEGORIES[0]): string {
		const categoryPermissions = category.permissions.map((p) => p.key);
		const selectedCount = categoryPermissions.filter((p) => formData.permissions.includes(p)).length;
		return `${selectedCount}/${categoryPermissions.length}`;
	}

	function isCategoryFullySelected(category: typeof PERMISSION_CATEGORIES[0]): boolean {
		const categoryPermissions = category.permissions.map((p) => p.key);
		return categoryPermissions.every((p) => formData.permissions.includes(p));
	}

	function clearSearch() {
		searchQuery = '';
	}

	function getPermissionLabel(permissionKey: string): string {
		for (const category of PERMISSION_CATEGORIES) {
			const perm = category.permissions.find((p) => p.key === permissionKey);
			if (perm) return perm.label;
		}
		return permissionKey;
	}
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<AdminLayout>
	<div class="space-y-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Rol Yönetimi</h1>
				<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
					Kullanıcı rollerini ve izinlerini yönetin
				</p>
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
				Yeni Rol
			</Button>
		</div>

		<!-- Search and Filters -->
		<div
			class="bg-white dark:bg-DarkerGrey shadow-sm border border-gray-200 dark:border-DarkLightGrey rounded-lg p-4"
		>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<!-- Search -->
				<div class="relative">
					<input
						type="text"
						placeholder="Rol ara..."
						bind:value={searchQuery}
						class="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-DarkLightGrey rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-DarkerGrey dark:text-white"
					/>
					<svg
						class="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					{#if searchQuery}
						<button
							on:click={clearSearch}
							class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
						>
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					{/if}
				</div>

				<!-- Filter -->
				<div class="flex space-x-2">
					<button
						on:click={() => (filterActive = 'all')}
						class="flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors {filterActive ===
						'all'
							? 'bg-blue-600 text-white'
							: 'bg-gray-100 dark:bg-DarkLightGrey text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-DarkLightGrey'}"
					>
						Tümü ({roles.length})
					</button>
					<button
						on:click={() => (filterActive = 'system')}
						class="flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors {filterActive ===
						'system'
							? 'bg-blue-600 text-white'
							: 'bg-gray-100 dark:bg-DarkLightGrey text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-DarkLightGrey'}"
					>
						Sistem Rolleri ({roles.filter((r) => r.isSystemRole).length})
					</button>
					<button
						on:click={() => (filterActive = 'custom')}
						class="flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors {filterActive ===
						'custom'
							? 'bg-blue-600 text-white'
							: 'bg-gray-100 dark:bg-DarkLightGrey text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-DarkLightGrey'}"
					>
						Özel Roller ({roles.filter((r) => !r.isSystemRole).length})
					</button>
				</div>
			</div>
		</div>

		<!-- Results info -->
		{#if searchQuery || filterActive !== 'all'}
			<div class="text-sm text-gray-600 dark:text-gray-400">
				{filteredRoles.length} sonuç bulundu
			</div>
		{/if}

		<!-- Error Message -->
		{#if loadError && !loading}
			<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
				<div class="flex items-start">
					<svg
						class="w-6 h-6 text-red-600 dark:text-red-400 mr-3 flex-shrink-0 mt-0.5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
					<div class="flex-1">
						<h3 class="text-lg font-medium text-red-800 dark:text-red-300 mb-2">
							Erişim Hatası
						</h3>
						<p class="text-sm text-red-700 dark:text-red-400 mb-4">
							{loadError}
						</p>
						<div class="bg-white dark:bg-DarkerGrey rounded-md p-4 border border-red-200 dark:border-red-800">
							<p class="text-sm font-medium text-gray-900 dark:text-white mb-2">
								Gerekli İzin:
							</p>
							<code class="text-xs bg-gray-100 dark:bg-DarkLightGrey text-red-600 dark:text-red-400 px-2 py-1 rounded">
								admin.roles.view
							</code>
						</div>
						<button
							on:click={loadRoles}
							class="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
						>
							Tekrar Dene
						</button>
					</div>
				</div>
			</div>
		{/if}

		<!-- Table -->
		{#if !loadError || loading}
			<div
				class="bg-white dark:bg-DarkerGrey shadow-sm border border-gray-200 dark:border-DarkLightGrey rounded-lg overflow-hidden"
			>
				<Table
					{columns}
					data={tableData}
					{loading}
					onEdit={openEditModal}
					onDelete={openDeleteModal}
					onView={openViewModal}
				/>
				{#if filteredRoles.length > 0}
					<Pagination
						{currentPage}
						{totalPages}
						{totalItems}
						{itemsPerPage}
						onPageChange={handlePageChange}
					/>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Add/Edit Modal -->
	<Modal
		isOpen={isModalOpen}
		title={editingRole ? 'Rol Düzenle' : 'Yeni Rol Ekle'}
		onClose={closeModal}
		size="xl"
	>
		<form on:submit={handleSubmit} class="space-y-6">
			<!-- Basic Info -->
			<div class="space-y-4">
				<h3 class="text-lg font-medium text-gray-900 dark:text-white">Temel Bilgiler</h3>

				<Input
					type="text"
					name="name"
					label="Rol Adı"
					bind:value={formData.name}
					error={formErrors.name}
					required
					placeholder="admin, moderator, vb."
					disabled={editingRole?.isSystemRole}
				/>

				<Input
					type="textarea"
					name="description"
					label="Açıklama"
					bind:value={formData.description}
					error={formErrors.description}
					placeholder="Rol açıklaması"
					rows={3}
				/>
			</div>

			<!-- Permissions -->
			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<h3 class="text-lg font-medium text-gray-900 dark:text-white">İzinler</h3>
					<span class="text-sm text-gray-600 dark:text-gray-400">
						{formData.permissions.length} izin seçildi
					</span>
				</div>

				{#if formErrors.permissions}
					<p class="text-sm text-red-600 dark:text-red-400">{formErrors.permissions}</p>
				{/if}

				<div
					class="max-h-96 overflow-y-auto border border-gray-300 dark:border-DarkLightGrey rounded-md"
				>
					{#each PERMISSION_CATEGORIES as category}
						<div class="border-b border-gray-200 dark:border-DarkLightGrey last:border-b-0">
							<!-- Category Header -->
							<button
								type="button"
								on:click={() => toggleCategory(category.name)}
								class="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-DarkLightGrey transition-colors"
							>
								<div class="flex items-center space-x-3">
									<svg
										class="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform {expandedCategories.has(
											category.name
										)
											? 'rotate-90'
											: ''}"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 5l7 7-7 7"
										/>
									</svg>
									<span class="font-medium text-gray-900 dark:text-white">{category.label}</span>
									<span class="text-sm text-gray-500 dark:text-gray-400">
										({getCategoryProgress(category)})
									</span>
								</div>
								<button
									type="button"
									on:click|stopPropagation={() => selectAllInCategory(category)}
									class="px-3 py-1 text-sm rounded-md border border-gray-300 dark:border-DarkLightGrey hover:bg-gray-100 dark:hover:bg-DarkerGrey transition-colors {isCategoryFullySelected(
										category
									)
										? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
										: 'bg-white dark:bg-DarkerGrey text-gray-700 dark:text-gray-300'}"
								>
									{isCategoryFullySelected(category) ? 'Tümünü Kaldır' : 'Tümünü Seç'}
								</button>
							</button>

							<!-- Category Permissions -->
							{#if expandedCategories.has(category.name)}
								<div class="px-4 pb-4 space-y-2 bg-gray-50 dark:bg-DarkerGrey">
									{#each category.permissions as permission}
										<label
											class="flex items-start p-3 rounded-md hover:bg-gray-100 dark:hover:bg-DarkLightGrey cursor-pointer transition-colors"
										>
											<input
												type="checkbox"
												checked={formData.permissions.includes(permission.key)}
												on:change={() => togglePermission(permission.key)}
												class="mt-0.5 h-4 w-4 rounded border-gray-300 dark:border-DarkLightGrey text-blue-600 focus:ring-blue-500"
											/>
											<div class="ml-3 flex-1">
												<span class="text-sm font-medium text-gray-900 dark:text-white">
													{permission.label}
												</span>
												{#if permission.description}
													<p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
														{permission.description}
													</p>
												{/if}
											</div>
										</label>
									{/each}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<!-- Footer Actions -->
			<div
				class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-DarkLightGrey"
			>
				<Button type="button" variant="secondary" on:click={closeModal}>İptal</Button>
				<Button type="submit" variant="primary" {loading}>
					{editingRole ? 'Güncelle' : 'Ekle'}
				</Button>
			</div>
		</form>
	</Modal>

	<!-- View Modal -->
	<Modal isOpen={isViewModalOpen} title="Rol Detayları" onClose={closeViewModal} size="lg">
		{#if viewingRole}
			<div class="space-y-6">
				<!-- Basic Info -->
				<div class="space-y-3">
					<div>
						<label class="text-sm font-medium text-gray-500 dark:text-gray-400">Rol Adı</label>
						<p class="mt-1 text-base text-gray-900 dark:text-white">{viewingRole.name}</p>
					</div>

					{#if viewingRole.description}
						<div>
							<label class="text-sm font-medium text-gray-500 dark:text-gray-400">Açıklama</label>
							<p class="mt-1 text-base text-gray-900 dark:text-white">
								{viewingRole.description}
							</p>
						</div>
					{/if}

					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="text-sm font-medium text-gray-500 dark:text-gray-400">
								Kullanıcı Sayısı
							</label>
							<p class="mt-1 text-base text-gray-900 dark:text-white">
								{viewingRole.userCount || 0}
							</p>
						</div>
						<div>
							<label class="text-sm font-medium text-gray-500 dark:text-gray-400">Rol Tipi</label>
							<p class="mt-1 text-base text-gray-900 dark:text-white">
								{viewingRole.isSystemRole ? 'Sistem Rolü' : 'Özel Rol'}
							</p>
						</div>
					</div>
				</div>

				<!-- Permissions -->
				<div class="space-y-3">
					<h3 class="text-lg font-medium text-gray-900 dark:text-white">
						İzinler ({viewingRole.permissions?.length || 0})
					</h3>

					<div
						class="max-h-96 overflow-y-auto border border-gray-200 dark:border-DarkLightGrey rounded-md"
					>
						{#each PERMISSION_CATEGORIES as category}
							{@const categoryPerms = category.permissions.filter((p) =>
								viewingRole.permissions?.includes(p.key)
							)}
							{#if categoryPerms.length > 0}
								<div
									class="border-b border-gray-200 dark:border-DarkLightGrey last:border-b-0 p-4"
								>
									<h4 class="font-medium text-gray-900 dark:text-white mb-2">
										{category.label}
									</h4>
									<ul class="space-y-2">
										{#each categoryPerms as permission}
											<li class="flex items-start text-sm">
												<svg
													class="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path
														fill-rule="evenodd"
														d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
														clip-rule="evenodd"
													/>
												</svg>
												<div>
													<p class="font-medium text-gray-900 dark:text-white">
														{permission.label}
													</p>
													{#if permission.description}
														<p class="text-gray-500 dark:text-gray-400">
															{permission.description}
														</p>
													{/if}
												</div>
											</li>
										{/each}
									</ul>
								</div>
							{/if}
						{/each}
					</div>
				</div>

				<!-- Metadata -->
				<div class="grid grid-cols-2 gap-4 text-sm">
					<div>
						<label class="text-gray-500 dark:text-gray-400">Oluşturulma Tarihi</label>
						<p class="text-gray-900 dark:text-white">
							{new Date(viewingRole.createdAt).toLocaleDateString('tr-TR', {
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</p>
					</div>
					<div>
						<label class="text-gray-500 dark:text-gray-400">Son Güncelleme</label>
						<p class="text-gray-900 dark:text-white">
							{new Date(viewingRole.updatedAt).toLocaleDateString('tr-TR', {
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</p>
					</div>
				</div>
			</div>
		{/if}
	</Modal>

	<!-- Delete Confirmation Modal -->
	<Modal isOpen={isDeleteModalOpen} title="Rolü Sil" onClose={closeDeleteModal} size="sm">
		<div class="space-y-4">
			<div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900 rounded-full">
				<svg
					class="w-6 h-6 text-red-600 dark:text-red-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
			</div>

			<div class="text-center">
				<p class="text-sm text-gray-600 dark:text-gray-300">
					<strong class="text-gray-900 dark:text-white">{deletingRole?.name}</strong> rolünü silmek
					istediğinizden emin misiniz?
				</p>
				{#if deletingRole?.userCount && deletingRole.userCount > 0}
					<p class="mt-2 text-sm text-red-600 dark:text-red-400">
						⚠️ Bu role atanmış {deletingRole.userCount} kullanıcı var!
					</p>
				{/if}
				<p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Bu işlem geri alınamaz.</p>
			</div>

			<div
				class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-DarkLightGrey"
			>
				<Button type="button" variant="secondary" on:click={closeDeleteModal}>İptal</Button>
				<Button type="button" variant="danger" on:click={handleDelete} {loading}>Sil</Button>
			</div>
		</div>
	</Modal>
</AdminLayout>
