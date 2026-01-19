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

	const pageTitle = 'Gönderi Yönetimi | Admin Panel';

	interface Post {
		id: number;
		title: string;
		content: string;
		slug: string;
		status: string;
		approved: boolean;
		authorId: number;
		author?: {
			id: number;
			username: string;
			email: string;
		};
		tags?: Array<{
			id: number;
			name: string;
			slug: string;
		}>;
		categories?: Array<{
			id: number;
			name: string;
			slug: string;
		}>;
		viewCount: number;
		publishedAt?: string;
		createdAt: string;
		updatedAt: string;
	}

	let posts: Post[] = [];
	let loading = false;
	let isModalOpen = false;
	let isDeleteModalOpen = false;
	let isViewModalOpen = false;
	let editingPost: Post | null = null;
	let deletingPost: Post | null = null;
	let viewingPost: Post | null = null;
	let currentPage = 1;
	let totalPages = 1;
	let totalItems = 0;
	const itemsPerPage = 10;

	// Form data
	let formData = {
		title: '',
		content: '',
		status: 'DRAFT',
		approved: false
	};

	const columns = [
		{ key: 'title', label: 'Başlık' },
		{ key: 'author.username', label: 'Kullanıcı' },
		{ key: 'status', label: 'Durum' },
		{ key: 'approved', label: 'Onaylı' },
		{ key: 'viewCount', label: 'Görüntülenme' },
		{ key: 'createdAt', label: 'Oluşturulma' }
	];

	const statusOptions = [
		{ value: 'DRAFT', label: 'Taslak' },
		{ value: 'PUBLISHED', label: 'Yayınlandı' },
		{ value: 'ARCHIVED', label: 'Arşivlendi' },
		{ value: 'SCHEDULED', label: 'Zamanlandı' }
	];

	const approvalOptions = [
		{ value: 'true', label: 'Onaylı' },
		{ value: 'false', label: 'Onay Bekliyor' }
	];

	onMount(() => {
		loadPosts();
	});

	async function loadPosts() {
		loading = true;
		try {
			// For admin panel, fetch ALL posts without status/approval filters
			// This is done by NOT passing status and approved query params
			const response = await getData<Post>('posts', false, itemsPerPage, currentPage);
			posts = response.data || [];
			totalItems = (response.meta as any)?.total || posts.length;
			totalPages = Math.ceil(totalItems / itemsPerPage);
		} catch (error) {
			toastStore.add('error', 'Gönderiler yüklenirken hata oluştu');
		} finally {
			loading = false;
		}
	}

	function openAddModal() {
		editingPost = null;
		formData = {
			title: '',
			content: '',
			status: 'DRAFT',
			approved: false
		};
		isModalOpen = true;
	}

	function openEditModal(post: Post) {
		editingPost = post;
		formData = {
			title: post.title,
			content: post.content,
			status: post.status,
			approved: post.approved
		};
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		editingPost = null;
	}

	function openViewModal(post: Post) {
		viewingPost = post;
		isViewModalOpen = true;
	}

	function closeViewModal() {
		isViewModalOpen = false;
		viewingPost = null;
	}

	function openDeleteModal(post: Post) {
		deletingPost = post;
		isDeleteModalOpen = true;
	}

	function closeDeleteModal() {
		isDeleteModalOpen = false;
		deletingPost = null;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;

		try {
			if (editingPost) {
				const result = await updateData('posts', editingPost.id, formData);
				if (result.success) {
					toastStore.add('success', 'Gönderi başarıyla güncellendi');
					closeModal();
					await loadPosts();
				} else {
					toastStore.add('error', result.message || 'Güncelleme başarısız');
				}
			} else {
				const result = await addData('posts', formData);
				if (result.success) {
					toastStore.add('success', 'Gönderi başarıyla eklendi');
					closeModal();
					await loadPosts();
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
		if (!deletingPost) return;

		loading = true;
		try {
			const result = await deleteData('posts', deletingPost.id);
			if (result.success) {
				toastStore.add('success', 'Gönderi başarıyla silindi');
				closeDeleteModal();
				await loadPosts();
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
		loadPosts();
	}

	async function approvePost(post: Post) {
		loading = true;
		try {
			const result = await updateData('posts', post.id, { approved: true });
			if (result.success) {
				toastStore.add('success', 'Gönderi onaylandı');
				await loadPosts();
			} else {
				toastStore.add('error', result.message || 'Onaylama başarısız');
			}
		} catch (error) {
			toastStore.add('error', 'Onaylama sırasında hata oluştu');
		} finally {
			loading = false;
		}
	}

	async function rejectPost(post: Post) {
		loading = true;
		try {
			const result = await updateData('posts', post.id, { approved: false });
			if (result.success) {
				toastStore.add('success', 'Gönderi reddedildi');
				await loadPosts();
			} else {
				toastStore.add('error', result.message || 'Reddetme başarısız');
			}
		} catch (error) {
			toastStore.add('error', 'Reddetme sırasında hata oluştu');
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<AdminLayout>
	<div class="space-y-6">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Gönderi Yönetimi</h1>
			<Button variant="primary" on:click={openAddModal}>
				<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
				Yeni Gönderi
			</Button>
		</div>

		<div
			class="bg-white dark:bg-DarkerGrey shadow-sm border border-gray-200 dark:border-DarkLightGrey rounded-lg overflow-hidden"
		>
			<Table
				{columns}
				data={posts}
				{loading}
				onView={openViewModal}
				onEdit={openEditModal}
				onDelete={openDeleteModal}
			/>
			{#if posts.length > 0}
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

	<!-- View Modal -->
	<Modal isOpen={isViewModalOpen} title="Gönderi Detayı" onClose={closeViewModal} size="lg">
		{#if viewingPost}
			<div class="space-y-4">
				<div>
					<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Başlık</h3>
					<p class="mt-1 text-base text-gray-900 dark:text-white">{viewingPost.title}</p>
				</div>
				<div>
					<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">İçerik</h3>
					<p class="mt-1 text-base text-gray-900 dark:text-white whitespace-pre-wrap">
						{viewingPost.content}
					</p>
				</div>
				<div>
					<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Yazar</h3>
					<p class="mt-1 text-base text-gray-900 dark:text-white">
						{viewingPost.author?.username || 'Bilinmiyor'}
					</p>
				</div>
				<div>
					<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Durum</h3>
					<p class="mt-1 text-base text-gray-900 dark:text-white">{viewingPost.status}</p>
				</div>
				<div>
					<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Onay Durumu</h3>
					<p class="mt-1 text-base text-gray-900 dark:text-white">
						{viewingPost.approved ? 'Onaylı' : 'Onay Bekliyor'}
					</p>
				</div>
				<div>
					<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Görüntülenme</h3>
					<p class="mt-1 text-base text-gray-900 dark:text-white">{viewingPost.viewCount}</p>
				</div>
				{#if viewingPost.tags && viewingPost.tags.length > 0}
					<div>
						<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Etiketler</h3>
						<div class="mt-1 flex flex-wrap gap-2">
							{#each viewingPost.tags as tag}
								<span
									class="px-2 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
								>
									#{tag.name}
								</span>
							{/each}
						</div>
					</div>
				{/if}
				{#if viewingPost.categories && viewingPost.categories.length > 0}
					<div>
						<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Kategoriler</h3>
						<div class="mt-1 flex flex-wrap gap-2">
							{#each viewingPost.categories as category}
								<span
									class="px-2 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded"
								>
									{category.name}
								</span>
							{/each}
						</div>
					</div>
				{/if}
				<div class="flex space-x-3 pt-4 border-t border-gray-200 dark:border-DarkLightGrey">
					{#if !viewingPost.approved}
						<Button variant="success" on:click={() => viewingPost && approvePost(viewingPost)}>Onayla</Button>
						<Button variant="danger" on:click={() => viewingPost && rejectPost(viewingPost)}>Reddet</Button>
					{:else}
						<Button variant="danger" on:click={() => viewingPost && rejectPost(viewingPost)}>Onayı Geri Al</Button>
					{/if}
					<Button variant="secondary" on:click={closeViewModal}>Kapat</Button>
				</div>
			</div>
		{/if}
	</Modal>

	<!-- Add/Edit Modal -->
	<Modal
		isOpen={isModalOpen}
		title={editingPost ? 'Gönderi Düzenle' : 'Yeni Gönderi Ekle'}
		onClose={closeModal}
		size="lg"
	>
		<form on:submit={handleSubmit} class="space-y-4">
			<Input
				type="text"
				name="title"
				label="Başlık"
				bind:value={formData.title}
				required
				placeholder="Gönderi başlığı"
			/>

			<Input
				type="textarea"
				name="content"
				label="İçerik"
				bind:value={formData.content}
				required
				placeholder="Gönderi içeriği"
				rows={6}
			/>

			<Input
				type="select"
				name="status"
				label="Durum"
				bind:value={formData.status}
				options={statusOptions}
				required
			/>

			<fieldset>
				<legend class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Onay Durumu
				</legend>
				<div class="flex items-center space-x-4">
					<label class="inline-flex items-center">
						<input
							type="radio"
							name="approved"
							bind:group={formData.approved}
							value={true}
							class="form-radio h-4 w-4 text-blue-600"
						/>
						<span class="ml-2 text-gray-700 dark:text-gray-300">Onaylı</span>
					</label>
					<label class="inline-flex items-center">
						<input
							type="radio"
							name="approved"
							bind:group={formData.approved}
							value={false}
							class="form-radio h-4 w-4 text-blue-600"
						/>
						<span class="ml-2 text-gray-700 dark:text-gray-300">Onay Bekliyor</span>
					</label>
				</div>
			</fieldset>

			<div
				class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-DarkLightGrey"
			>
				<Button type="button" variant="secondary" on:click={closeModal}>İptal</Button>
				<Button type="submit" variant="primary" {loading}>
					{editingPost ? 'Güncelle' : 'Ekle'}
				</Button>
			</div>
		</form>
	</Modal>

	<!-- Delete Confirmation Modal -->
	<Modal isOpen={isDeleteModalOpen} title="Gönderiyi Sil" onClose={closeDeleteModal} size="sm">
		<div class="space-y-4">
			<p class="text-sm text-gray-600 dark:text-gray-300">
				<strong>{deletingPost?.title}</strong> gönderisini silmek istediğinizden emin misiniz? Bu
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
