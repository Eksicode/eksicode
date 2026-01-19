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

	const pageTitle = 'Kariyer İlanları | Admin Panel';

	interface Job {
		id: string;
		title: string;
		company: string;
		location: string;
		type: string;
		description: string;
		requirements?: string;
		salary?: string;
		isActive: boolean;
		expiresAt?: string;
		createdAt: string;
		updatedAt: string;
	}

	let jobs: Job[] = [];
	let loading = false;
	let isModalOpen = false;
	let isDeleteModalOpen = false;
	let isViewModalOpen = false;
	let editingJob: Job | null = null;
	let deletingJob: Job | null = null;
	let viewingJob: Job | null = null;
	let currentPage = 1;
	let totalPages = 1;
	let totalItems = 0;
	const itemsPerPage = 10;

	// Form data
	let formData = {
		title: '',
		company: '',
		location: '',
		type: 'full-time',
		description: '',
		requirements: '',
		salary: '',
		isActive: true,
		expiresAt: ''
	};

	const columns = [
		{ key: 'title', label: 'İş Unvanı' },
		{ key: 'company', label: 'Şirket' },
		{ key: 'location', label: 'Lokasyon' },
		{ key: 'type', label: 'Tip' },
		{ key: 'isActive', label: 'Aktif' },
		{ key: 'createdAt', label: 'Oluşturulma' }
	];

	const jobTypeOptions = [
		{ value: 'full-time', label: 'Tam Zamanlı' },
		{ value: 'part-time', label: 'Yarı Zamanlı' },
		{ value: 'contract', label: 'Sözleşmeli' },
		{ value: 'freelance', label: 'Serbest' },
		{ value: 'internship', label: 'Staj' }
	];

	onMount(() => {
		loadJobs();
	});

	async function loadJobs() {
		loading = true;
		try {
			const response = await getData<Job>('jobs', false, itemsPerPage, currentPage);
			jobs = response.data || [];
			totalItems = (response.meta as any)?.total || jobs.length;
			totalPages = Math.ceil(totalItems / itemsPerPage);
		} catch (error) {
			toastStore.add('error', 'İş ilanları yüklenirken hata oluştu');
		} finally {
			loading = false;
		}
	}

	function openAddModal() {
		editingJob = null;
		formData = {
			title: '',
			company: '',
			location: '',
			type: 'full-time',
			description: '',
			requirements: '',
			salary: '',
			isActive: true,
			expiresAt: ''
		};
		isModalOpen = true;
	}

	function openEditModal(job: Job) {
		editingJob = job;
		formData = {
			title: job.title,
			company: job.company,
			location: job.location,
			type: job.type,
			description: job.description,
			requirements: job.requirements || '',
			salary: job.salary || '',
			isActive: job.isActive,
			expiresAt: job.expiresAt
				? new Date(job.expiresAt).toISOString().split('T')[0]
				: ''
		};
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		editingJob = null;
	}

	function openViewModal(job: Job) {
		viewingJob = job;
		isViewModalOpen = true;
	}

	function closeViewModal() {
		isViewModalOpen = false;
		viewingJob = null;
	}

	function openDeleteModal(job: Job) {
		deletingJob = job;
		isDeleteModalOpen = true;
	}

	function closeDeleteModal() {
		isDeleteModalOpen = false;
		deletingJob = null;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;

		try {
			const data = { ...formData };
			if (data.expiresAt) {
				data.expiresAt = new Date(data.expiresAt).toISOString();
			}

			if (editingJob) {
				const result = await updateData('jobs', editingJob.id, data);
				if (result.success) {
					toastStore.add('success', 'İş ilanı başarıyla güncellendi');
					closeModal();
					await loadJobs();
				} else {
					toastStore.add('error', result.message || 'Güncelleme başarısız');
				}
			} else {
				const result = await addData('jobs', data);
				if (result.success) {
					toastStore.add('success', 'İş ilanı başarıyla eklendi');
					closeModal();
					await loadJobs();
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
		if (!deletingJob) return;

		loading = true;
		try {
			const result = await deleteData('jobs', deletingJob.id);
			if (result.success) {
				toastStore.add('success', 'İş ilanı başarıyla silindi');
				closeDeleteModal();
				await loadJobs();
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
		loadJobs();
	}
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<AdminLayout>
	<div class="space-y-6">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Kariyer İlanları</h1>
			<Button variant="primary" on:click={openAddModal}>
				<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
				Yeni İlan
			</Button>
		</div>

		<div
			class="bg-white dark:bg-DarkerGrey shadow-sm border border-gray-200 dark:border-DarkLightGrey rounded-lg overflow-hidden"
		>
			<Table
				{columns}
				data={jobs}
				{loading}
				onView={openViewModal}
				onEdit={openEditModal}
				onDelete={openDeleteModal}
			/>
			{#if jobs.length > 0}
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
	<Modal isOpen={isViewModalOpen} title="İş İlanı Detayı" onClose={closeViewModal} size="lg">
		{#if viewingJob}
			<div class="space-y-4">
				<div>
					<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">İş Unvanı</h3>
					<p class="mt-1 text-base text-gray-900 dark:text-white">{viewingJob.title}</p>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Şirket</h3>
						<p class="mt-1 text-base text-gray-900 dark:text-white">{viewingJob.company}</p>
					</div>
					<div>
						<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Lokasyon</h3>
						<p class="mt-1 text-base text-gray-900 dark:text-white">{viewingJob.location}</p>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Tip</h3>
						<p class="mt-1 text-base text-gray-900 dark:text-white">{viewingJob.type}</p>
					</div>
					{#if viewingJob.salary}
						<div>
							<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Maaş</h3>
							<p class="mt-1 text-base text-gray-900 dark:text-white">{viewingJob.salary}</p>
						</div>
					{/if}
				</div>
				<div>
					<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Açıklama</h3>
					<p class="mt-1 text-base text-gray-900 dark:text-white whitespace-pre-wrap">
						{viewingJob.description}
					</p>
				</div>
				{#if viewingJob.requirements}
					<div>
						<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Gereksinimler</h3>
						<p class="mt-1 text-base text-gray-900 dark:text-white whitespace-pre-wrap">
							{viewingJob.requirements}
						</p>
					</div>
				{/if}
				<div class="flex justify-end pt-4 border-t border-gray-200 dark:border-DarkLightGrey">
					<Button variant="secondary" on:click={closeViewModal}>Kapat</Button>
				</div>
			</div>
		{/if}
	</Modal>

	<!-- Add/Edit Modal -->
	<Modal
		isOpen={isModalOpen}
		title={editingJob ? 'İş İlanı Düzenle' : 'Yeni İş İlanı Ekle'}
		onClose={closeModal}
		size="xl"
	>
		<form on:submit={handleSubmit} class="space-y-4">
			<Input
				type="text"
				name="title"
				label="İş Unvanı"
				bind:value={formData.title}
				required
				placeholder="Senior Backend Developer"
			/>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Input
					type="text"
					name="company"
					label="Şirket"
					bind:value={formData.company}
					required
					placeholder="Tech Company Inc."
				/>
				<Input
					type="text"
					name="location"
					label="Lokasyon"
					bind:value={formData.location}
					required
					placeholder="İstanbul, Türkiye"
				/>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Input
					type="select"
					name="type"
					label="Çalışma Tipi"
					bind:value={formData.type}
					options={jobTypeOptions}
					required
				/>
				<Input
					type="text"
					name="salary"
					label="Maaş Aralığı"
					bind:value={formData.salary}
					placeholder="40,000 - 60,000 TL"
				/>
			</div>

			<Input
				type="textarea"
				name="description"
				label="İş Açıklaması"
				bind:value={formData.description}
				required
				placeholder="İş ilanının detaylı açıklaması"
				rows={6}
			/>

			<Input
				type="textarea"
				name="requirements"
				label="Gereksinimler"
				bind:value={formData.requirements}
				placeholder="İş için gerekli nitelikler ve deneyimler"
				rows={6}
			/>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Input
					type="date"
					name="expiresAt"
					label="Son Başvuru Tarihi"
					bind:value={formData.expiresAt}
				/>
				<div class="flex items-end">
					<Input
						type="checkbox"
						name="isActive"
						label=""
						bind:value={formData.isActive}
						placeholder="İlanı aktif et"
					/>
				</div>
			</div>

			<div
				class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-DarkLightGrey"
			>
				<Button type="button" variant="secondary" on:click={closeModal}>İptal</Button>
				<Button type="submit" variant="primary" {loading}>
					{editingJob ? 'Güncelle' : 'Ekle'}
				</Button>
			</div>
		</form>
	</Modal>

	<!-- Delete Confirmation Modal -->
	<Modal isOpen={isDeleteModalOpen} title="İş İlanını Sil" onClose={closeDeleteModal} size="sm">
		<div class="space-y-4">
			<p class="text-sm text-gray-600 dark:text-gray-300">
				<strong>{deletingJob?.title}</strong> ilanını silmek istediğinizden emin misiniz? Bu işlem
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
