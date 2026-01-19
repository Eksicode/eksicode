<script lang="ts">
	import { authStore } from '$lib/auth/store';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let showDropdown = false;

	function handleLogout() {
		authStore.logout();
		goto('/login');
	}

	function toggleDropdown() {
		showDropdown = !showDropdown;
	}

	function closeDropdown() {
		showDropdown = false;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.profile-dropdown')) {
			closeDropdown();
		}
	}

	function goToProfile() {
		closeDropdown();
		goto('/profile');
	}

	function goToSettings() {
		closeDropdown();
		goto('/settings');
	}

	$: pageTitle = getPageTitle($page.url.pathname);

	function getPageTitle(pathname: string): string {
		if (pathname === '/') return 'Dashboard';
		if (pathname.startsWith('/users')) return 'Kullanıcı Yönetimi';
		if (pathname.startsWith('/posts')) return 'Gönderi Yönetimi';
		if (pathname.startsWith('/pages')) return 'Sayfa Yönetimi';
		if (pathname.startsWith('/roles')) return 'Rol Yönetimi';
		if (pathname.startsWith('/menus')) return 'Menü Yönetimi';
		if (pathname.startsWith('/hashtags')) return 'Etiket Yönetimi';
		if (pathname.startsWith('/sources')) return 'Kaynak Yönetimi';
		if (pathname.startsWith('/jobs')) return 'Kariyer Yönetimi';
		if (pathname.startsWith('/settings')) return 'Sistem Ayarları';
		if (pathname.startsWith('/profile')) return 'Profil Ayarları';
		return 'Admin Panel';
	}
</script>

<svelte:window on:click={handleClickOutside} />

<header class="bg-white dark:bg-DarkerGrey border-b border-gray-200 dark:border-DarkLightGrey px-6 py-4">
	<div class="flex items-center justify-between">
		<h1 class="text-xl font-semibold text-gray-900 dark:text-white">{pageTitle}</h1>
		<div class="flex items-center gap-4">
			{#if $authStore.user}
				<!-- Profile Dropdown -->
				<div class="relative profile-dropdown">
					<button
						on:click={toggleDropdown}
						class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-DarkLightGrey transition-colors"
					>
						<!-- Avatar -->
						<div class="flex items-center gap-2">
							{#if $authStore.user.profilePicture}
								<img 
									src={$authStore.user.profilePicture} 
									alt={$authStore.user.username}
									class="w-8 h-8 rounded-full object-cover"
								/>
							{:else}
								<div class="w-8 h-8 rounded-full bg-eksiCode text-white flex items-center justify-center text-sm font-medium">
									{$authStore.user.username?.charAt(0).toUpperCase() || 'A'}
								</div>
							{/if}
							<div class="text-left hidden md:block">
								<p class="text-sm font-medium text-gray-900 dark:text-white">
									{$authStore.user.username}
								</p>
								<p class="text-xs text-gray-500 dark:text-gray-400">
									{$authStore.user.roles?.[0] || 'Admin'}
								</p>
							</div>
							<svg 
								class="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform {showDropdown ? 'rotate-180' : ''}"
								fill="currentColor" 
								viewBox="0 0 20 20"
							>
								<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
							</svg>
						</div>
					</button>

					<!-- Dropdown Menu -->
					{#if showDropdown}
						<div class="absolute right-0 mt-2 w-56 bg-white dark:bg-DarkerGrey rounded-lg shadow-lg border border-gray-200 dark:border-DarkLightGrey py-1 z-50">
							<!-- User Info -->
							<div class="px-4 py-3 border-b border-gray-200 dark:border-DarkLightGrey">
								<p class="text-sm font-medium text-gray-900 dark:text-white">
									{$authStore.user.username}
								</p>
								<p class="text-xs text-gray-500 dark:text-gray-400 truncate">
									{$authStore.user.email}
								</p>
							</div>

							<!-- Menu Items -->
							<div class="py-1">
								<button
									on:click={goToProfile}
									class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-DarkLightGrey flex items-center gap-2"
								>
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
									</svg>
									Profil Ayarları
								</button>

								<button
									on:click={goToSettings}
									class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-DarkLightGrey flex items-center gap-2"
								>
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
									</svg>
									Sistem Ayarları
								</button>
							</div>

							<!-- Logout -->
							<div class="border-t border-gray-200 dark:border-DarkLightGrey py-1">
								<button
									on:click={handleLogout}
									class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-DarkLightGrey flex items-center gap-2"
								>
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
									</svg>
									Çıkış Yap
								</button>
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</header>
