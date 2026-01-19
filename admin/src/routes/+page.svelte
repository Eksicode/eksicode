<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import AdminLayout from '$lib/components/layout/AdminLayout.svelte';
	import { getData } from '$lib/utils/api';

	const pageTitle = 'Admin Panel | Dashboard';

	export let data: PageData;

	let stats = {
		totalUsers: 0,
		totalPosts: 0,
		pendingPosts: 0,
		totalComments: 0,
		totalPages: 0,
		totalHashtags: 0,
		totalSources: 0,
		totalJobs: 0
	};

	let loading = true;

	onMount(async () => {
		console.log('Admin Dashboard loaded');
		await loadStats();
	});

	async function loadStats() {
		loading = true;
		try {
			// Load all statistics
			const [users, posts, pages, hashtags, sources, jobs] = await Promise.all([
				getData('users', true, 1, 1),
				getData('posts', true, 1, 1),
				getData('pages', true, 1, 1),
				getData('hashtags', true, 1, 1),
				getData('sources', true, 1, 1),
				getData('jobs', true, 1, 1)
			]);

			stats.totalUsers = (users.meta as any)?.total || 0;
			stats.totalPosts = (posts.meta as any)?.total || 0;
			stats.totalPages = (pages.meta as any)?.total || 0;
			stats.totalHashtags = (hashtags.meta as any)?.total || 0;
			stats.totalSources = (sources.meta as any)?.total || 0;
			stats.totalJobs = (jobs.meta as any)?.total || 0;

			// Count pending posts
			if (posts.data && Array.isArray(posts.data)) {
				stats.pendingPosts = posts.data.filter((p: any) => p.status === 'pending').length;
			}
		} catch (error) {
			console.error('Error loading statistics:', error);
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
			<h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Admin Panel</h1>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<!-- Stats Cards -->
			<a
				href="/users"
				class="bg-white dark:bg-DarkerGrey rounded-lg p-6 shadow-sm border border-gray-200 dark:border-DarkLightGrey hover:shadow-md transition-shadow"
			>
				<div class="flex items-center justify-between">
					<div>
						<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Toplam Kullanıcı</h3>
						{#if loading}
							<div class="animate-pulse h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
						{:else}
							<p class="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
						{/if}
					</div>
					<svg class="w-12 h-12 text-blue-600 opacity-50" fill="currentColor" viewBox="0 0 20 20">
						<path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
					</svg>
				</div>
			</a>

			<a
				href="/posts"
				class="bg-white dark:bg-DarkerGrey rounded-lg p-6 shadow-sm border border-gray-200 dark:border-DarkLightGrey hover:shadow-md transition-shadow"
			>
				<div class="flex items-center justify-between">
					<div>
						<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Toplam Gönderi</h3>
						{#if loading}
							<div class="animate-pulse h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
						{:else}
							<p class="text-3xl font-bold text-green-600">{stats.totalPosts}</p>
						{/if}
					</div>
					<svg class="w-12 h-12 text-green-600 opacity-50" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path>
					</svg>
				</div>
			</a>

			<a
				href="/posts"
				class="bg-white dark:bg-DarkerGrey rounded-lg p-6 shadow-sm border border-gray-200 dark:border-DarkLightGrey hover:shadow-md transition-shadow"
			>
				<div class="flex items-center justify-between">
					<div>
						<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Bekleyen Onay</h3>
						{#if loading}
							<div class="animate-pulse h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
						{:else}
							<p class="text-3xl font-bold text-yellow-600">{stats.pendingPosts}</p>
						{/if}
					</div>
					<svg class="w-12 h-12 text-yellow-600 opacity-50" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
					</svg>
				</div>
			</a>

			<a
				href="/pages"
				class="bg-white dark:bg-DarkerGrey rounded-lg p-6 shadow-sm border border-gray-200 dark:border-DarkLightGrey hover:shadow-md transition-shadow"
			>
				<div class="flex items-center justify-between">
					<div>
						<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Toplam Sayfa</h3>
						{#if loading}
							<div class="animate-pulse h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
						{:else}
							<p class="text-3xl font-bold text-purple-600">{stats.totalPages}</p>
						{/if}
					</div>
					<svg class="w-12 h-12 text-purple-600 opacity-50" fill="currentColor" viewBox="0 0 20 20">
						<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
						<path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path>
					</svg>
				</div>
			</a>
		</div>

		<!-- Additional Stats -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<a
				href="/hashtags"
				class="bg-white dark:bg-DarkerGrey rounded-lg p-6 shadow-sm border border-gray-200 dark:border-DarkLightGrey hover:shadow-md transition-shadow"
			>
				<div class="flex items-center justify-between">
					<div>
						<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Toplam Etiket</h3>
						{#if loading}
							<div class="animate-pulse h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
						{:else}
							<p class="text-3xl font-bold text-pink-600">{stats.totalHashtags}</p>
						{/if}
					</div>
					<svg class="w-12 h-12 text-pink-600 opacity-50" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
					</svg>
				</div>
			</a>

			<a
				href="/sources"
				class="bg-white dark:bg-DarkerGrey rounded-lg p-6 shadow-sm border border-gray-200 dark:border-DarkLightGrey hover:shadow-md transition-shadow"
			>
				<div class="flex items-center justify-between">
					<div>
						<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Toplam Kaynak</h3>
						{#if loading}
							<div class="animate-pulse h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
						{:else}
							<p class="text-3xl font-bold text-indigo-600">{stats.totalSources}</p>
						{/if}
					</div>
					<svg class="w-12 h-12 text-indigo-600 opacity-50" fill="currentColor" viewBox="0 0 20 20">
						<path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"></path>
					</svg>
				</div>
			</a>

			<a
				href="/jobs"
				class="bg-white dark:bg-DarkerGrey rounded-lg p-6 shadow-sm border border-gray-200 dark:border-DarkLightGrey hover:shadow-md transition-shadow"
			>
				<div class="flex items-center justify-between">
					<div>
						<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Kariyer İlanı</h3>
						{#if loading}
							<div class="animate-pulse h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
						{:else}
							<p class="text-3xl font-bold text-teal-600">{stats.totalJobs}</p>
						{/if}
					</div>
					<svg class="w-12 h-12 text-teal-600 opacity-50" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"></path>
					</svg>
				</div>
			</a>

			<a
				href="/menus"
				class="bg-white dark:bg-DarkerGrey rounded-lg p-6 shadow-sm border border-gray-200 dark:border-DarkLightGrey hover:shadow-md transition-shadow"
			>
				<div class="flex items-center justify-between">
					<div>
						<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Menü Öğesi</h3>
						{#if loading}
							<div class="animate-pulse h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
						{:else}
							<p class="text-3xl font-bold text-orange-600">{stats.totalPages}</p>
						{/if}
					</div>
					<svg class="w-12 h-12 text-orange-600 opacity-50" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
					</svg>
				</div>
			</a>
		</div>

		<!-- Admin Quick Actions -->
		<div
			class="bg-white dark:bg-DarkerGrey rounded-lg p-6 shadow-sm border border-gray-200 dark:border-DarkLightGrey"
		>
			<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Hızlı İşlemler</h3>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<a
					href="/users"
					class="block p-4 border border-gray-200 dark:border-DarkLightGrey rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
				>
					<h4 class="font-medium text-gray-900 dark:text-white">Kullanıcı Yönetimi</h4>
					<p class="text-sm text-gray-600 dark:text-gray-300">Kullanıcıları görüntüle ve yönet</p>
				</a>

				<a
					href="/posts"
					class="block p-4 border border-gray-200 dark:border-DarkLightGrey rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
				>
					<h4 class="font-medium text-gray-900 dark:text-white">Gönderi Yönetimi</h4>
					<p class="text-sm text-gray-600 dark:text-gray-300">Gönderileri onayla ve yönet</p>
				</a>

				<a
					href="/settings"
					class="block p-4 border border-gray-200 dark:border-DarkLightGrey rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
				>
					<h4 class="font-medium text-gray-900 dark:text-white">Sistem Ayarları</h4>
					<p class="text-sm text-gray-600 dark:text-gray-300">Genel ayarları düzenle</p>
				</a>
			</div>
		</div>

		<!-- Current User Info -->
		<div
			class="bg-white dark:bg-DarkerGrey rounded-lg p-6 shadow-sm border border-gray-200 dark:border-DarkLightGrey"
		>
			<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Admin Bilgileri</h3>
			<div class="space-y-2">
				<p class="text-sm text-gray-600 dark:text-gray-300">
					<span class="font-medium">Kullanıcı:</span> {data?.user?.username || 'N/A'}
				</p>
				<p class="text-sm text-gray-600 dark:text-gray-300">
					<span class="font-medium">Rol:</span> {data?.user?.roles?.join(', ') || 'N/A'}
				</p>
			</div>
		</div>
	</div>
</AdminLayout>
