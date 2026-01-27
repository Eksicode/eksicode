<script lang="ts">
	import { onMount } from 'svelte';
	import AdminLayout from '$lib/components/layout/AdminLayout.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { getData, updateData, addData } from '$lib/utils/api';

	const pageTitle = 'Admin Panel | Settings';

	let activeTab = 'general';
	let loading = false;
	let saveMessage = '';
	let saveMessageType: 'success' | 'error' = 'success';

	// Settings state
	let settings = {
		// General Settings
		siteName: 'EksiCode',
		siteDescription: 'Yazılım Geliştirme Topluluğu',
		siteUrl: 'https://eksicode.com',
		adminEmail: 'admin@eksicode.com',
		
		// Content Settings
		postsPerPage: 20,
		commentsPerPage: 10,
		allowGuestComments: false,
		moderationRequired: true,
		
		// Security Settings
		requireEmailVerification: true,
		maxLoginAttempts: 5,
		sessionTimeout: 3600,
		twoFactorEnabled: false,
		
		// Email Settings
		emailHost: '',
		emailPort: 587,
		emailUser: '',
		emailFrom: 'noreply@eksicode.com',
		emailSecure: true,
		
		// API Settings
		apiRateLimit: 100,
		apiTimeout: 30000,
		enableApiDocs: true,
		
		// Notification Settings
		emailNotifications: true,
		browserNotifications: false,
		digestFrequency: 'daily'
	};

	const tabs = [
		{ id: 'general', label: 'Genel', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
		{ id: 'content', label: 'İçerik', icon: 'M9 2a1 1 0 000 2h2a1 1 0 100-2H9z M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z' },
		{ id: 'security', label: 'Güvenlik', icon: 'M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z' },
		{ id: 'email', label: 'E-posta', icon: 'M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' },
		{ id: 'api', label: 'API', icon: 'M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z' },
		{ id: 'notifications', label: 'Bildirimler', icon: 'M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z' }
	];

	onMount(async () => {
		await loadSettings();
	});

	async function loadSettings() {
		loading = true;
		try {
			// Load settings from API
			const response = await getData('settings', false);
			if (response.data && response.data.length > 0) {
				// Map API response to settings object
				response.data.forEach((setting: any) => {
					if (setting.key in settings) {
						(settings as any)[setting.key] = setting.value;
					}
				});
			}
		} catch (error) {
			console.error('Error loading settings:', error);
		} finally {
			loading = false;
		}
	}

	async function handleSave() {
		loading = true;
		saveMessage = '';
		
		try {
			// Convert settings object to array of key-value pairs
			const settingsArray = Object.entries(settings).map(([key, value]) => ({
				key,
				value,
				category: activeTab
			}));

			// Save each setting
			const promises = settingsArray.map(setting => 
				updateData('settings', setting.key, setting).catch(() => 
					addData('settings', setting)
				)
			);

			await Promise.all(promises);
			
			saveMessage = 'Ayarlar başarıyla kaydedildi!';
			saveMessageType = 'success';
			
			setTimeout(() => {
				saveMessage = '';
			}, 3000);
		} catch (error) {
			console.error('Error saving settings:', error);
			saveMessage = 'Ayarlar kaydedilirken bir hata oluştu!';
			saveMessageType = 'error';
		} finally {
			loading = false;
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
				<h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Sistem Ayarları</h1>
				<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
					Uygulama genelindeki ayarları yönetin
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
				{#if activeTab === 'general'}
					<div class="space-y-6">
						<div>
							<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Genel Ayarlar</h3>
							<div class="grid grid-cols-1 gap-6">
								<Input label="Site Adı" bind:value={settings.siteName} placeholder="EksiCode" />
								<div>
									<label for="site-description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Site Açıklaması
									</label>
									<textarea
										id="site-description"
										bind:value={settings.siteDescription}
										rows="3"
										class="w-full px-3 py-2 border border-gray-300 dark:border-DarkLightGrey rounded-md shadow-sm focus:outline-none focus:ring-eksiCode focus:border-eksiCode bg-white dark:bg-DarkLightGrey text-gray-900 dark:text-white"
										placeholder="Yazılım geliştirme topluluğu..."
									></textarea>
								</div>
								<Input label="Site URL" bind:value={settings.siteUrl} type="url" placeholder="https://eksicode.com" />
								<Input label="Admin E-posta" bind:value={settings.adminEmail} type="email" placeholder="admin@eksicode.com" />
							</div>
						</div>
					</div>

				{:else if activeTab === 'content'}
					<div class="space-y-6">
						<div>
							<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">İçerik Ayarları</h3>
							<div class="grid grid-cols-1 gap-6">
								<Input label="Sayfa Başına Gönderi Sayısı" bind:value={settings.postsPerPage} type="number" min="1" max="100" />
								<Input label="Sayfa Başına Yorum Sayısı" bind:value={settings.commentsPerPage} type="number" min="1" max="100" />
								
								<div class="flex items-center justify-between">
									<div>
										<label for="allow-guest-comments" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
											Misafir Yorumlarına İzin Ver
										</label>
										<p class="text-sm text-gray-500 dark:text-gray-400">Kayıtsız kullanıcılar yorum yapabilir</p>
									</div>
									<label class="relative inline-flex items-center cursor-pointer">
										<input id="allow-guest-comments" type="checkbox" bind:checked={settings.allowGuestComments} class="sr-only peer" />
										<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-eksiCode/20 dark:peer-focus:ring-eksiCode/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-eksiCode"></div>
									</label>
								</div>

								<div class="flex items-center justify-between">
									<div>
										<label for="moderation-required" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
											Moderasyon Gerekli
										</label>
										<p class="text-sm text-gray-500 dark:text-gray-400">Gönderiler yayınlanmadan önce onay gerektir</p>
									</div>
									<label class="relative inline-flex items-center cursor-pointer">
										<input id="moderation-required" type="checkbox" bind:checked={settings.moderationRequired} class="sr-only peer" />
										<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-eksiCode/20 dark:peer-focus:ring-eksiCode/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-eksiCode"></div>
									</label>
								</div>
							</div>
						</div>
					</div>

				{:else if activeTab === 'security'}
					<div class="space-y-6">
						<div>
							<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Güvenlik Ayarları</h3>
							<div class="grid grid-cols-1 gap-6">
								<div class="flex items-center justify-between">
									<div>
										<label for="require-email-verification" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
											E-posta Doğrulama Zorunlu
										</label>
										<p class="text-sm text-gray-500 dark:text-gray-400">Kullanıcılar e-posta adreslerini doğrulamalı</p>
									</div>
									<label class="relative inline-flex items-center cursor-pointer">
										<input id="require-email-verification" type="checkbox" bind:checked={settings.requireEmailVerification} class="sr-only peer" />
										<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-eksiCode/20 dark:peer-focus:ring-eksiCode/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-eksiCode"></div>
									</label>
								</div>

								<Input label="Maksimum Giriş Denemesi" bind:value={settings.maxLoginAttempts} type="number" min="3" max="10" />
								<Input label="Oturum Zaman Aşımı (saniye)" bind:value={settings.sessionTimeout} type="number" min="300" max="86400" />

								<div class="flex items-center justify-between">
									<div>
										<label for="two-factor-enabled" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
											İki Faktörlü Kimlik Doğrulama
										</label>
										<p class="text-sm text-gray-500 dark:text-gray-400">Ekstra güvenlik katmanı ekle</p>
									</div>
									<label class="relative inline-flex items-center cursor-pointer">
										<input id="two-factor-enabled" type="checkbox" bind:checked={settings.twoFactorEnabled} class="sr-only peer" />
										<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-eksiCode/20 dark:peer-focus:ring-eksiCode/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-eksiCode"></div>
									</label>
								</div>
							</div>
						</div>
					</div>

				{:else if activeTab === 'email'}
					<div class="space-y-6">
						<div>
							<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">E-posta Ayarları</h3>
							<div class="grid grid-cols-1 gap-6">
								<Input label="SMTP Host" bind:value={settings.emailHost} placeholder="smtp.gmail.com" />
								<Input label="SMTP Port" bind:value={settings.emailPort} type="number" placeholder="587" />
								<Input label="SMTP Kullanıcı Adı" bind:value={settings.emailUser} placeholder="user@example.com" />
								<Input label="Gönderen E-posta" bind:value={settings.emailFrom} type="email" placeholder="noreply@eksicode.com" />
								
								<div class="flex items-center justify-between">
									<div>
										<label for="email-secure" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
											SSL/TLS Kullan
										</label>
										<p class="text-sm text-gray-500 dark:text-gray-400">Güvenli bağlantı kullan</p>
									</div>
									<label class="relative inline-flex items-center cursor-pointer">
										<input id="email-secure" type="checkbox" bind:checked={settings.emailSecure} class="sr-only peer" />
										<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-eksiCode/20 dark:peer-focus:ring-eksiCode/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-eksiCode"></div>
									</label>
								</div>
							</div>
						</div>
					</div>

				{:else if activeTab === 'api'}
					<div class="space-y-6">
						<div>
							<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">API Ayarları</h3>
							<div class="grid grid-cols-1 gap-6">
								<Input label="Rate Limit (dakika başına istek)" bind:value={settings.apiRateLimit} type="number" min="10" max="1000" />
								<Input label="Timeout (milisaniye)" bind:value={settings.apiTimeout} type="number" min="1000" max="60000" />
								
								<div class="flex items-center justify-between">
									<div>
										<label for="enable-api-docs" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
											API Dokümantasyonu
										</label>
										<p class="text-sm text-gray-500 dark:text-gray-400">Swagger/OpenAPI dokümantasyonunu etkinleştir</p>
									</div>
									<label class="relative inline-flex items-center cursor-pointer">
										<input id="enable-api-docs" type="checkbox" bind:checked={settings.enableApiDocs} class="sr-only peer" />
										<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-eksiCode/20 dark:peer-focus:ring-eksiCode/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-eksiCode"></div>
									</label>
								</div>
							</div>
						</div>
					</div>

				{:else if activeTab === 'notifications'}
					<div class="space-y-6">
						<div>
							<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Bildirim Ayarları</h3>
							<div class="grid grid-cols-1 gap-6">
								<div class="flex items-center justify-between">
									<div>
										<label for="email-notifications" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
											E-posta Bildirimleri
										</label>
										<p class="text-sm text-gray-500 dark:text-gray-400">Önemli olaylar için e-posta gönder</p>
									</div>
									<label class="relative inline-flex items-center cursor-pointer">
										<input id="email-notifications" type="checkbox" bind:checked={settings.emailNotifications} class="sr-only peer" />
										<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-eksiCode/20 dark:peer-focus:ring-eksiCode/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-eksiCode"></div>
									</label>
								</div>

								<div class="flex items-center justify-between">
									<div>
										<label for="browser-notifications" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
											Tarayıcı Bildirimleri
										</label>
										<p class="text-sm text-gray-500 dark:text-gray-400">Push bildirimleri etkinleştir</p>
									</div>
									<label class="relative inline-flex items-center cursor-pointer">
										<input id="browser-notifications" type="checkbox" bind:checked={settings.browserNotifications} class="sr-only peer" />
										<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-eksiCode/20 dark:peer-focus:ring-eksiCode/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-eksiCode"></div>
									</label>
								</div>

								<div>
									<label for="digest-frequency" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Özet E-posta Sıklığı
									</label>
									<select
										id="digest-frequency"
										bind:value={settings.digestFrequency}
										class="w-full px-3 py-2 border border-gray-300 dark:border-DarkLightGrey rounded-md shadow-sm focus:outline-none focus:ring-eksiCode focus:border-eksiCode bg-white dark:bg-DarkLightGrey text-gray-900 dark:text-white"
									>
										<option value="realtime">Anında</option>
										<option value="hourly">Saatlik</option>
										<option value="daily">Günlük</option>
										<option value="weekly">Haftalık</option>
										<option value="never">Hiçbir Zaman</option>
									</select>
								</div>
							</div>
						</div>
					</div>
				{/if}

				<!-- Save Button -->
				<div class="mt-6 flex justify-end">
					<Button on:click={handleSave} disabled={loading}>
						{loading ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
					</Button>
				</div>
			</div>
		</div>
	</div>
</AdminLayout>
