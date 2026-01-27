<script lang="ts">
	import { onMount } from 'svelte';
	import AdminLayout from '$lib/components/layout/AdminLayout.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { authStore } from '$lib/auth/store';
	import { apiClient } from '$lib/api/client';
	import { goto } from '$app/navigation';

	const pageTitle = 'Admin Panel | Profile';

	let activeTab = 'personal';
	let loading = false;
	let saveMessage = '';
	let saveMessageType: 'success' | 'error' = 'success';
	let showPasswordModal = false;
	let showDeleteModal = false;

	// Profile state
	let profile = {
		username: '',
		email: '',
		firstName: '',
		lastName: '',
		bio: '',
		phone: '',
		location: '',
		website: '',
		profilePicture: ''
	};

	// Password change
	let passwordData = {
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
	};

	// Preferences
	let preferences = {
		language: 'tr',
		timezone: 'Europe/Istanbul',
		dateFormat: 'DD/MM/YYYY',
		theme: 'auto',
		emailOnComment: true,
		emailOnReply: true,
		emailOnMention: true,
		emailNewsletter: false
	};

	// Privacy settings
	let privacy = {
		profileVisible: true,
		showEmail: false,
		showLocation: false,
		allowMessages: true,
		activityVisible: true
	};

	const tabs = [
		{ id: 'personal', label: 'Kişisel Bilgiler', icon: 'M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' },
		{ id: 'security', label: 'Güvenlik', icon: 'M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z' },
		{ id: 'preferences', label: 'Tercihler', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
		{ id: 'privacy', label: 'Gizlilik', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' }
	];

	onMount(async () => {
		await loadProfile();
	});

	async function loadProfile() {
		loading = true;
		try {
			const user = $authStore.user;
			if (user) {
				profile.username = user.username || '';
				profile.email = user.email || '';
				profile.firstName = user.firstName || '';
				profile.lastName = user.lastName || '';
				profile.profilePicture = user.profilePicture || '';
				
				// Load additional profile data from API
				const token = $authStore.token;
				if (token) {
					const response = await apiClient.get('/auth/me', token);
					if (response.success && response.data) {
						const userData = response.data.data || response.data;
						Object.assign(profile, {
							bio: userData.bio || '',
							phone: userData.phone || '',
							location: userData.location || '',
							website: userData.website || ''
						});
						
						// Load preferences
						if (userData.preferences) {
							Object.assign(preferences, userData.preferences);
						}
						
						// Load privacy settings
						if (userData.privacy) {
							Object.assign(privacy, userData.privacy);
						}
					}
				}
			}
		} catch (error) {
			console.error('Error loading profile:', error);
		} finally {
			loading = false;
		}
	}

	async function handleSaveProfile() {
		loading = true;
		saveMessage = '';
		
		try {
			const token = $authStore.token;
			if (!token) {
				throw new Error('Authentication required');
			}

			const response = await apiClient.put('/users/profile', profile, token);
			
			if (response.success) {
				// Update auth store with new user data
				authStore.setUser({ ...$authStore.user!, ...profile });
				saveMessage = 'Profil başarıyla güncellendi!';
				saveMessageType = 'success';
			} else {
				throw new Error(response.message || 'Profil güncellenemedi');
			}
			
			setTimeout(() => {
				saveMessage = '';
			}, 3000);
		} catch (error: any) {
			console.error('Error saving profile:', error);
			saveMessage = error.message || 'Profil kaydedilirken bir hata oluştu!';
			saveMessageType = 'error';
		} finally {
			loading = false;
		}
	}

	async function handleChangePassword() {
		if (passwordData.newPassword !== passwordData.confirmPassword) {
			saveMessage = 'Yeni şifreler eşleşmiyor!';
			saveMessageType = 'error';
			return;
		}

		if (passwordData.newPassword.length < 8) {
			saveMessage = 'Şifre en az 8 karakter olmalıdır!';
			saveMessageType = 'error';
			return;
		}

		loading = true;
		saveMessage = '';
		
		try {
			const token = $authStore.token;
			if (!token) {
				throw new Error('Authentication required');
			}

			const response = await apiClient.post('/auth/change-password', {
				currentPassword: passwordData.currentPassword,
				newPassword: passwordData.newPassword
			}, token);
			
			if (response.success) {
				saveMessage = 'Şifre başarıyla değiştirildi!';
				saveMessageType = 'success';
				showPasswordModal = false;
				passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
			} else {
				throw new Error(response.message || 'Şifre değiştirilemedi');
			}
			
			setTimeout(() => {
				saveMessage = '';
			}, 3000);
		} catch (error: any) {
			console.error('Error changing password:', error);
			saveMessage = error.message || 'Şifre değiştirilirken bir hata oluştu!';
			saveMessageType = 'error';
		} finally {
			loading = false;
		}
	}

	async function handleSavePreferences() {
		loading = true;
		saveMessage = '';
		
		try {
			const token = $authStore.token;
			if (!token) {
				throw new Error('Authentication required');
			}

			const response = await apiClient.put('/users/preferences', preferences, token);
			
			if (response.success) {
				saveMessage = 'Tercihler başarıyla güncellendi!';
				saveMessageType = 'success';
			} else {
				throw new Error(response.message || 'Tercihler güncellenemedi');
			}
			
			setTimeout(() => {
				saveMessage = '';
			}, 3000);
		} catch (error: any) {
			console.error('Error saving preferences:', error);
			saveMessage = error.message || 'Tercihler kaydedilirken bir hata oluştu!';
			saveMessageType = 'error';
		} finally {
			loading = false;
		}
	}

	async function handleSavePrivacy() {
		loading = true;
		saveMessage = '';
		
		try {
			const token = $authStore.token;
			if (!token) {
				throw new Error('Authentication required');
			}

			const response = await apiClient.put('/users/privacy', privacy, token);
			
			if (response.success) {
				saveMessage = 'Gizlilik ayarları başarıyla güncellendi!';
				saveMessageType = 'success';
			} else {
				throw new Error(response.message || 'Gizlilik ayarları güncellenemedi');
			}
			
			setTimeout(() => {
				saveMessage = '';
			}, 3000);
		} catch (error: any) {
			console.error('Error saving privacy settings:', error);
			saveMessage = error.message || 'Gizlilik ayarları kaydedilirken bir hata oluştu!';
			saveMessageType = 'error';
		} finally {
			loading = false;
		}
	}

	async function handleDeleteAccount() {
		loading = true;
		
		try {
			const token = $authStore.token;
			if (!token) {
				throw new Error('Authentication required');
			}

			const response = await apiClient.delete('/users/account', token);
			
			if (response.success) {
				authStore.logout();
				goto('/login');
			} else {
				throw new Error(response.message || 'Hesap silinemedi');
			}
		} catch (error: any) {
			console.error('Error deleting account:', error);
			saveMessage = error.message || 'Hesap silinirken bir hata oluştu!';
			saveMessageType = 'error';
			showDeleteModal = false;
		} finally {
			loading = false;
		}
	}

	function handleFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			const file = input.files[0];
			const reader = new FileReader();
			
			reader.onload = (e) => {
				profile.profilePicture = e.target?.result as string;
			};
			
			reader.readAsDataURL(file);
		}
	}

	function setActiveTab(tabId: string) {
		activeTab = tabId;
		saveMessage = '';
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
				<h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Profil Ayarları</h1>
				<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
					Kişisel bilgilerinizi ve hesap ayarlarınızı yönetin
				</p>
			</div>
		</div>

		<!-- Save Message -->
		{#if saveMessage}
			<div class="rounded-md p-4 {saveMessageType === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'}">
				<p class="text-sm font-medium">{saveMessage}</p>
			</div>
		{/if}

		<!-- Tabs -->
		<div class="bg-white dark:bg-DarkerGrey rounded-lg shadow-sm border border-gray-200 dark:border-DarkLightGrey overflow-hidden">
			<div class="border-b border-gray-200 dark:border-DarkLightGrey">
				<nav class="flex -mb-px overflow-x-auto">
					{#each tabs as tab}
						<button
							on:click={() => setActiveTab(tab.id)}
							class="px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors {activeTab === tab.id
								? 'border-eksiCode text-eksiCode'
								: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}"
						>
							<div class="flex items-center gap-2">
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d={tab.icon} clip-rule="evenodd" />
								</svg>
								{tab.label}
							</div>
						</button>
					{/each}
				</nav>
			</div>

			<!-- Tab Content -->
			<div class="p-6">
				{#if activeTab === 'personal'}
					<div class="space-y-6">
						<!-- Profile Picture -->
						<div class="flex items-center gap-6">
							<div class="relative">
								{#if profile.profilePicture}
									<img 
										src={profile.profilePicture} 
										alt="Profile" 
										class="w-24 h-24 rounded-full object-cover"
									/>
								{:else}
									<div class="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
										<svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
										</svg>
									</div>
								{/if}
								<label 
									for="profile-upload" 
									class="absolute bottom-0 right-0 bg-eksiCode text-white p-2 rounded-full cursor-pointer hover:bg-eksiCode/90 transition-colors"
								>
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
									</svg>
									<input 
										id="profile-upload" 
										type="file" 
										accept="image/*" 
										class="hidden" 
										on:change={handleFileUpload}
									/>
								</label>
							</div>
							<div>
								<h3 class="text-lg font-medium text-gray-900 dark:text-white">
									{profile.username || 'Kullanıcı Adı'}
								</h3>
								<p class="text-sm text-gray-500 dark:text-gray-400">{profile.email || 'email@example.com'}</p>
								<p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
									Roller: {$authStore.user?.roles?.join(', ') || 'Yok'}
								</p>
							</div>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<Input label="Kullanıcı Adı" bind:value={profile.username} placeholder="kullaniciadi" disabled />
							<Input label="E-posta" bind:value={profile.email} type="email" placeholder="email@example.com" />
							<Input label="Ad" bind:value={profile.firstName} placeholder="Adınız" />
							<Input label="Soyad" bind:value={profile.lastName} placeholder="Soyadınız" />
							<Input label="Telefon" bind:value={profile.phone} type="tel" placeholder="+90 555 555 55 55" />
							<Input label="Konum" bind:value={profile.location} placeholder="İstanbul, Türkiye" />
						</div>

						<div>
							<label for="profile-website" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Web Sitesi
							</label>
							<Input id="profile-website" bind:value={profile.website} type="url" placeholder="https://example.com" />
						</div>

						<div>
							<label for="profile-bio" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Biyografi
							</label>
							<textarea
								id="profile-bio"
								bind:value={profile.bio}
								rows="4"
								class="w-full px-3 py-2 border border-gray-300 dark:border-DarkLightGrey rounded-md shadow-sm focus:outline-none focus:ring-eksiCode focus:border-eksiCode bg-white dark:bg-DarkLightGrey text-gray-900 dark:text-white"
								placeholder="Kendinizden bahsedin..."
							></textarea>
						</div>

						<div class="flex justify-end">
							<Button on:click={handleSaveProfile} disabled={loading}>
								{loading ? 'Kaydediliyor...' : 'Profili Kaydet'}
							</Button>
						</div>
					</div>

				{:else if activeTab === 'security'}
					<div class="space-y-6">
						<!-- Change Password -->
						<div>
							<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Şifre Değiştir</h3>
							<div class="space-y-4">
								<p class="text-sm text-gray-600 dark:text-gray-400">
									Hesabınızın güvenliğini sağlamak için düzenli olarak şifrenizi değiştirin.
								</p>
								<Button on:click={() => showPasswordModal = true}>
									Şifre Değiştir
								</Button>
							</div>
						</div>

						<!-- Two-Factor Authentication -->
						<div class="pt-6 border-t border-gray-200 dark:border-DarkLightGrey">
							<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">İki Faktörlü Kimlik Doğrulama</h3>
							<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
								Hesabınıza ekstra bir güvenlik katmanı ekleyin.
							</p>
							<Button variant="secondary">
								2FA'yı Etkinleştir
							</Button>
						</div>

						<!-- Active Sessions -->
						<div class="pt-6 border-t border-gray-200 dark:border-DarkLightGrey">
							<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Aktif Oturumlar</h3>
							<div class="space-y-3">
								<div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-DarkLightGrey rounded-lg">
									<div>
										<p class="text-sm font-medium text-gray-900 dark:text-white">Mevcut Oturum</p>
										<p class="text-xs text-gray-500 dark:text-gray-400">Son etkinlik: Az önce</p>
									</div>
									<span class="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300 rounded">
										Aktif
									</span>
								</div>
							</div>
						</div>

						<!-- Danger Zone -->
						<div class="pt-6 border-t border-red-200 dark:border-red-900">
							<h3 class="text-lg font-medium text-red-600 dark:text-red-400 mb-4">Tehlike Bölgesi</h3>
							<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
								Hesabınızı kalıcı olarak silin. Bu işlem geri alınamaz.
							</p>
							<Button variant="danger" on:click={() => showDeleteModal = true}>
								Hesabı Sil
							</Button>
						</div>
					</div>

				{:else if activeTab === 'preferences'}
					<div class="space-y-6">
						<div>
							<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Görünüm ve Dil</h3>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label for="preferences-language" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Dil
									</label>
									<select
										id="preferences-language"
										bind:value={preferences.language}
										class="w-full px-3 py-2 border border-gray-300 dark:border-DarkLightGrey rounded-md shadow-sm focus:outline-none focus:ring-eksiCode focus:border-eksiCode bg-white dark:bg-DarkLightGrey text-gray-900 dark:text-white"
									>
										<option value="tr">Türkçe</option>
										<option value="en">English</option>
									</select>
								</div>

								<div>
									<label for="preferences-theme" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Tema
									</label>
									<select
										id="preferences-theme"
										bind:value={preferences.theme}
										class="w-full px-3 py-2 border border-gray-300 dark:border-DarkLightGrey rounded-md shadow-sm focus:outline-none focus:ring-eksiCode focus:border-eksiCode bg-white dark:bg-DarkLightGrey text-gray-900 dark:text-white"
									>
										<option value="auto">Otomatik</option>
										<option value="light">Açık</option>
										<option value="dark">Koyu</option>
									</select>
								</div>

								<div>
									<label for="preferences-timezone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Saat Dilimi
									</label>
									<select
										id="preferences-timezone"
										bind:value={preferences.timezone}
										class="w-full px-3 py-2 border border-gray-300 dark:border-DarkLightGrey rounded-md shadow-sm focus:outline-none focus:ring-eksiCode focus:border-eksiCode bg-white dark:bg-DarkLightGrey text-gray-900 dark:text-white"
									>
										<option value="Europe/Istanbul">İstanbul (GMT+3)</option>
										<option value="Europe/London">Londra (GMT+0)</option>
										<option value="America/New_York">New York (GMT-5)</option>
									</select>
								</div>

								<div>
									<label for="preferences-date-format" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Tarih Formatı
									</label>
									<select
										id="preferences-date-format"
										bind:value={preferences.dateFormat}
										class="w-full px-3 py-2 border border-gray-300 dark:border-DarkLightGrey rounded-md shadow-sm focus:outline-none focus:ring-eksiCode focus:border-eksiCode bg-white dark:bg-DarkLightGrey text-gray-900 dark:text-white"
									>
										<option value="DD/MM/YYYY">DD/MM/YYYY</option>
										<option value="MM/DD/YYYY">MM/DD/YYYY</option>
										<option value="YYYY-MM-DD">YYYY-MM-DD</option>
									</select>
								</div>
							</div>
						</div>

						<div class="pt-6 border-t border-gray-200 dark:border-DarkLightGrey">
							<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">E-posta Bildirimleri</h3>
							<div class="space-y-4">
								<div class="flex items-center justify-between">
									<div>
										<label for="email-on-comment" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
											Yorumlar
										</label>
										<p class="text-sm text-gray-500 dark:text-gray-400">Gönderilerime yorum yapıldığında bildir</p>
									</div>
									<label class="relative inline-flex items-center cursor-pointer">
										<input id="email-on-comment" type="checkbox" bind:checked={preferences.emailOnComment} class="sr-only peer" />
										<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-eksiCode/20 dark:peer-focus:ring-eksiCode/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-eksiCode"></div>
									</label>
								</div>

								<div class="flex items-center justify-between">
									<div>
										<label for="email-on-reply" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
											Yanıtlar
										</label>
										<p class="text-sm text-gray-500 dark:text-gray-400">Yorumuma yanıt verildiğinde bildir</p>
									</div>
									<label class="relative inline-flex items-center cursor-pointer">
										<input id="email-on-reply" type="checkbox" bind:checked={preferences.emailOnReply} class="sr-only peer" />
										<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-eksiCode/20 dark:peer-focus:ring-eksiCode/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-eksiCode"></div>
									</label>
								</div>

								<div class="flex items-center justify-between">
									<div>
										<label for="email-on-mention" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
											Bahsetmeler
										</label>
										<p class="text-sm text-gray-500 dark:text-gray-400">Benden bahsedildiğinde bildir</p>
									</div>
									<label class="relative inline-flex items-center cursor-pointer">
										<input id="email-on-mention" type="checkbox" bind:checked={preferences.emailOnMention} class="sr-only peer" />
										<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-eksiCode/20 dark:peer-focus:ring-eksiCode/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-eksiCode"></div>
									</label>
								</div>

								<div class="flex items-center justify-between">
									<div>
										<label for="email-newsletter" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
											Bülten
										</label>
										<p class="text-sm text-gray-500 dark:text-gray-400">Haftalık bülten e-postası al</p>
									</div>
									<label class="relative inline-flex items-center cursor-pointer">
										<input id="email-newsletter" type="checkbox" bind:checked={preferences.emailNewsletter} class="sr-only peer" />
										<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-eksiCode/20 dark:peer-focus:ring-eksiCode/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-eksiCode"></div>
									</label>
								</div>
							</div>
						</div>

						<div class="flex justify-end">
							<Button on:click={handleSavePreferences} disabled={loading}>
								{loading ? 'Kaydediliyor...' : 'Tercihleri Kaydet'}
							</Button>
						</div>
					</div>

				{:else if activeTab === 'privacy'}
					<div class="space-y-6">
						<div>
							<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Profil Gizliliği</h3>
							<div class="space-y-4">
								<div class="flex items-center justify-between">
									<div>
										<label for="profile-visible" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
											Profili Herkese Aç
										</label>
										<p class="text-sm text-gray-500 dark:text-gray-400">Profilim herkes tarafından görülebilir</p>
									</div>
									<label class="relative inline-flex items-center cursor-pointer">
										<input id="profile-visible" type="checkbox" bind:checked={privacy.profileVisible} class="sr-only peer" />
										<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-eksiCode/20 dark:peer-focus:ring-eksiCode/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-eksiCode"></div>
									</label>
								</div>

								<div class="flex items-center justify-between">
									<div>
										<label for="show-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
											E-posta Adresini Göster
										</label>
										<p class="text-sm text-gray-500 dark:text-gray-400">E-posta adresim profilimde görünsün</p>
									</div>
									<label class="relative inline-flex items-center cursor-pointer">
										<input id="show-email" type="checkbox" bind:checked={privacy.showEmail} class="sr-only peer" />
										<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-eksiCode/20 dark:peer-focus:ring-eksiCode/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-eksiCode"></div>
									</label>
								</div>

								<div class="flex items-center justify-between">
									<div>
										<label for="show-location" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
											Konumu Göster
										</label>
										<p class="text-sm text-gray-500 dark:text-gray-400">Konumum profilimde görünsün</p>
									</div>
									<label class="relative inline-flex items-center cursor-pointer">
										<input id="show-location" type="checkbox" bind:checked={privacy.showLocation} class="sr-only peer" />
										<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-eksiCode/20 dark:peer-focus:ring-eksiCode/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-eksiCode"></div>
									</label>
								</div>

								<div class="flex items-center justify-between">
									<div>
										<label for="allow-messages" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
											Mesaj Almaya İzin Ver
										</label>
										<p class="text-sm text-gray-500 dark:text-gray-400">Diğer kullanıcılar bana mesaj gönderebilir</p>
									</div>
									<label class="relative inline-flex items-center cursor-pointer">
										<input id="allow-messages" type="checkbox" bind:checked={privacy.allowMessages} class="sr-only peer" />
										<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-eksiCode/20 dark:peer-focus:ring-eksiCode/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-eksiCode"></div>
									</label>
								</div>

								<div class="flex items-center justify-between">
									<div>
										<label for="activity-visible" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
											Aktivite Geçmişini Göster
										</label>
										<p class="text-sm text-gray-500 dark:text-gray-400">Gönderilerim ve yorumlarım görünebilir</p>
									</div>
									<label class="relative inline-flex items-center cursor-pointer">
										<input id="activity-visible" type="checkbox" bind:checked={privacy.activityVisible} class="sr-only peer" />
										<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-eksiCode/20 dark:peer-focus:ring-eksiCode/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-eksiCode"></div>
									</label>
								</div>
							</div>
						</div>

						<div class="flex justify-end">
							<Button on:click={handleSavePrivacy} disabled={loading}>
								{loading ? 'Kaydediliyor...' : 'Gizlilik Ayarlarını Kaydet'}
							</Button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</AdminLayout>

<!-- Change Password Modal -->
<Modal bind:show={showPasswordModal} title="Şifre Değiştir">
	<div class="space-y-4">
		<Input 
			label="Mevcut Şifre" 
			type="password" 
			bind:value={passwordData.currentPassword} 
			placeholder="Mevcut şifreniz"
		/>
		<Input 
			label="Yeni Şifre" 
			type="password" 
			bind:value={passwordData.newPassword} 
			placeholder="Yeni şifreniz"
		/>
		<Input 
			label="Yeni Şifre (Tekrar)" 
			type="password" 
			bind:value={passwordData.confirmPassword} 
			placeholder="Yeni şifrenizi tekrar girin"
		/>
		<div class="flex justify-end gap-2 mt-6">
			<Button variant="secondary" on:click={() => showPasswordModal = false}>
				İptal
			</Button>
			<Button on:click={handleChangePassword} disabled={loading}>
				{loading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
			</Button>
		</div>
	</div>
</Modal>

<!-- Delete Account Modal -->
<Modal bind:show={showDeleteModal} title="Hesabı Sil">
	<div class="space-y-4">
		<p class="text-sm text-gray-600 dark:text-gray-400">
			Hesabınızı silmek üzeresiniz. Bu işlem <strong>geri alınamaz</strong> ve tüm verileriniz kalıcı olarak silinecektir.
		</p>
		<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
			<p class="text-sm text-red-800 dark:text-red-200 font-medium">
				Uyarı: Bu işlem geri alınamaz!
			</p>
		</div>
		<div class="flex justify-end gap-2 mt-6">
			<Button variant="secondary" on:click={() => showDeleteModal = false}>
				İptal
			</Button>
			<Button variant="danger" on:click={handleDeleteAccount} disabled={loading}>
				{loading ? 'Siliniyor...' : 'Evet, Hesabı Sil'}
			</Button>
		</div>
	</div>
</Modal>
