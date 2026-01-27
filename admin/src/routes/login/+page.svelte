<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { authStore } from '$lib/auth/store';
	import { apiClient } from '$lib/api/client';

	const pageTitle = 'Admin Girişi | eksiCode';

	let email = '';
	let password = '';
	let error = '';
	let loading = false;
	let emailError = '';
	let passwordError = '';

	onMount(() => {
		// Check if already authenticated
		if (authStore.isAuthenticated) {
			goto('/');
		}

		// Check for error query param
		const errorParam = $page.url.searchParams.get('error');
		if (errorParam === 'unauthorized') {
			error = 'Bu sayfaya erişim yetkiniz yok. Sadece admin, superadmin veya moderator rolleri erişebilir.';
		}
	});

	function validateForm(): boolean {
		emailError = '';
		passwordError = '';

		if (!email.trim()) {
			emailError = 'E-posta adresi gereklidir.';
			return false;
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			emailError = 'Geçerli bir e-posta adresi giriniz.';
			return false;
		}

		if (!password) {
			passwordError = 'Şifre gereklidir.';
			return false;
		}

		if (password.length < 6) {
			passwordError = 'Şifre en az 6 karakter olmalıdır.';
			return false;
		}

		return true;
	}

	async function handleLogin() {
		error = '';
		emailError = '';
		passwordError = '';

		if (!validateForm()) {
			return;
		}

		loading = true;

		try {
			const response = await apiClient.post('/auth/login', {
				userInfo: email.trim(),
				password
			});

			if (response.success && response.data) {
				const loginData = response.data.data || response.data;
				const token = loginData.token || loginData.accessToken;
				const user = loginData.user || loginData;

				if (token) {
					// Store token
					authStore.setToken(token);
					authStore.setUser(user);

					// Check user roles
					const roles = user?.roles || [];
					const allowedRoles = ['admin', 'superadmin', 'moderator'];
					const hasAccess = roles.some((role: string) =>
						allowedRoles.includes(role.toLowerCase())
					);

					if (!hasAccess) {
						error = 'Bu sayfaya erişim yetkiniz yok. Sadece admin, superadmin veya moderator rolleri erişebilir.';
						authStore.logout();
						return;
					}

					// Redirect to dashboard
					goto('/');
				} else {
					error = response.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
				}
			} else {
				error = response.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
			}
		} catch (err: any) {
			error = err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.';
		} finally {
			loading = false;
		}
	}

	function handleEmailBlur() {
		if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			emailError = 'Geçerli bir e-posta adresi giriniz.';
		} else {
			emailError = '';
		}
	}

	function handlePasswordBlur() {
		if (password && password.length < 6) {
			passwordError = 'Şifre en az 6 karakter olmalıdır.';
		} else {
			passwordError = '';
		}
	}
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-DarkerGrey px-4 py-12">
	<div class="max-w-md w-full">
		<div
			class="bg-white dark:bg-DarkGrey rounded-lg shadow-lg border border-gray-200 dark:border-DarkLightGrey p-8"
		>
			<div class="mb-8">
				<h2 class="text-center text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
					Admin Girişi
				</h2>
				<p class="text-center text-sm text-gray-600 dark:text-gray-400">
					Sadece yetkili kullanıcılar giriş yapabilir
				</p>
			</div>

			<form class="space-y-6" on:submit|preventDefault={handleLogin}>
				{#if error}
					<div
						class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md text-sm"
						role="alert"
					>
						{error}
					</div>
				{/if}

				<div class="space-y-5">
					<div>
						<label
							for="email"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>
							E-posta
						</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							autocomplete="email"
							bind:value={email}
							on:blur={handleEmailBlur}
							class="appearance-none relative block w-full px-3 py-2.5 border {emailError
								? 'border-red-300 dark:border-red-700'
								: 'border-gray-300 dark:border-DarkLightGrey'} placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-DarkerGrey rounded-md focus:outline-none focus:ring-2 focus:ring-eksiCode focus:border-eksiCode sm:text-sm transition-colors"
							placeholder="E-posta adresi"
							aria-invalid={emailError ? 'true' : 'false'}
							aria-describedby={emailError ? 'email-error' : undefined}
						/>
						{#if emailError}
							<p id="email-error" class="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
								{emailError}
							</p>
						{/if}
					</div>

					<div>
						<label
							for="password"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>
							Şifre
						</label>
						<input
							id="password"
							name="password"
							type="password"
							required
							autocomplete="current-password"
							bind:value={password}
							on:blur={handlePasswordBlur}
							class="appearance-none relative block w-full px-3 py-2.5 border {passwordError
								? 'border-red-300 dark:border-red-700'
								: 'border-gray-300 dark:border-DarkLightGrey'} placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-DarkerGrey rounded-md focus:outline-none focus:ring-2 focus:ring-eksiCode focus:border-eksiCode sm:text-sm transition-colors"
							placeholder="Şifre"
							aria-invalid={passwordError ? 'true' : 'false'}
							aria-describedby={passwordError ? 'password-error' : undefined}
						/>
						{#if passwordError}
							<p
								id="password-error"
								class="mt-1 text-sm text-red-600 dark:text-red-400"
								role="alert"
							>
								{passwordError}
							</p>
						{/if}
					</div>
				</div>

				<div>
					<button
						type="submit"
						disabled={loading}
						class="group relative w-full flex justify-center items-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-eksiCode hover:bg-eksiCodeMedium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-eksiCode disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{#if loading}
							<svg
								class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							<span>Giriş yapılıyor...</span>
						{:else}
							<span>Giriş Yap</span>
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
