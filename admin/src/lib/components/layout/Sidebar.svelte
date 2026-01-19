<script lang="ts">
	import { page } from '$app/stores';
</script>

<aside class="w-64 hidden lg:block" aria-label="Sidebar">
	<div
		class="overflow-y-auto py-4 px-3 bg-gray-50 rounded-lg border-gray-300 border text-gray-900 dark:text-white dark:bg-DarkerGrey dark:border-DarkLightGrey h-full"
	>
		<ul class="space-y-2">
			<li>
				<a
					href="/"
					class="flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-DarkLightGrey {($page.url.pathname === '/') ? 'bg-gray-100 dark:bg-DarkLightGrey' : ''}"
				>
					<svg
						class="w-5 h-5 text-gray-500 dark:text-gray-400"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"
						></path>
						<path
							d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"
						></path>
					</svg>
					<span class="ml-3">Dashboard</span>
				</a>
			</li>
			<li>
				<a
					href="/pages"
					class="flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-DarkLightGrey {($page.url.pathname.startsWith('/pages')) ? 'bg-gray-100 dark:bg-DarkLightGrey' : ''}"
				>
					<svg
						class="w-5 h-5 text-gray-500 dark:text-gray-400"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
						></path>
						<path
							fill-rule="evenodd"
							d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
							clip-rule="evenodd"
						></path>
					</svg>
					<span class="flex-1 ml-3 whitespace-nowrap">Sayfalar</span>
				</a>
			</li>
			<li>
				<a
					href="/users"
					class="flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-DarkLightGrey {($page.url.pathname.startsWith('/users')) ? 'bg-gray-100 dark:bg-DarkLightGrey' : ''}"
				>
					<svg
						class="w-5 h-5 text-gray-500 dark:text-gray-400"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"
						></path>
					</svg>
					<span class="flex-1 ml-3 whitespace-nowrap">Kullanıcılar</span>
				</a>
			</li>
			<li>
				<a
					href="/posts"
					class="flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-DarkLightGrey {($page.url.pathname.startsWith('/posts')) ? 'bg-gray-100 dark:bg-DarkLightGrey' : ''}"
				>
					<svg
						class="w-5 h-5 text-gray-500 dark:text-gray-400"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fill-rule="evenodd"
							d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
							clip-rule="evenodd"
						></path>
					</svg>
					<span class="flex-1 ml-3 whitespace-nowrap">Posts</span>
				</a>
			</li>
			<li>
				<a
					href="/roles"
					class="flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-DarkLightGrey {($page.url.pathname.startsWith('/roles')) ? 'bg-gray-100 dark:bg-DarkLightGrey' : ''}"
				>
					<svg
						class="w-5 h-5 text-gray-500 dark:text-gray-400"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fill-rule="evenodd"
							d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
							clip-rule="evenodd"
						></path>
					</svg>
					<span class="flex-1 ml-3 whitespace-nowrap">Roller</span>
				</a>
			</li>
			<li>
				<a
					href="/menus"
					class="flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-DarkLightGrey {($page.url.pathname.startsWith('/menus')) ? 'bg-gray-100 dark:bg-DarkLightGrey' : ''}"
				>
					<svg
						class="w-5 h-5 text-gray-500 dark:text-gray-400"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fill-rule="evenodd"
							d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
							clip-rule="evenodd"
						></path>
					</svg>
					<span class="flex-1 ml-3 whitespace-nowrap">Menüler</span>
				</a>
			</li>
			<li>
				<a
					href="/hashtags"
					class="flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-DarkLightGrey {($page.url.pathname.startsWith('/hashtags')) ? 'bg-gray-100 dark:bg-DarkLightGrey' : ''}"
				>
					<svg
						class="w-5 h-5 text-gray-500 dark:text-gray-400"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fill-rule="evenodd"
							d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
							clip-rule="evenodd"
						></path>
					</svg>
					<span class="flex-1 ml-3 whitespace-nowrap">Etiketler</span>
				</a>
			</li>
			<li>
				<a
					href="/sources"
					class="flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-DarkLightGrey {($page.url.pathname.startsWith('/sources')) ? 'bg-gray-100 dark:bg-DarkLightGrey' : ''}"
				>
					<svg
						class="w-5 h-5 text-gray-500 dark:text-gray-400"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 11.09a.998.998 0 00-.9.9 11.115 11.115 0 01.25 3.762 1 1 0 001.89 0 8.969 8.969 0 001.05-.174v-4.102l-1.29-.517zM9.3 11.09l-1.3.52v4.102a8.969 8.969 0 001.05.174 1 1 0 00.89-.89 11.115 11.115 0 01-.25-3.762z"
						></path>
					</svg>
					<span class="flex-1 ml-3 whitespace-nowrap">Kaynaklar</span>
				</a>
			</li>
			<li>
				<a
					href="/telegram-groups"
					class="flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-DarkLightGrey {($page.url.pathname.startsWith('/telegram-groups')) ? 'bg-gray-100 dark:bg-DarkLightGrey' : ''}"
				>
					<svg
						class="w-5 h-5 text-gray-500 dark:text-gray-400"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"
						></path>
						<path
							d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"
						></path>
					</svg>
					<span class="flex-1 ml-3 whitespace-nowrap">Telegram Grupları</span>
				</a>
			</li>
			<li>
				<a
					href="/jobs"
					class="flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-DarkLightGrey {($page.url.pathname.startsWith('/jobs')) ? 'bg-gray-100 dark:bg-DarkLightGrey' : ''}"
				>
					<svg
						class="w-5 h-5 text-gray-500 dark:text-gray-400"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fill-rule="evenodd"
							d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
							clip-rule="evenodd"
						></path>
						<path
							d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"
						></path>
					</svg>
					<span class="flex-1 ml-3 whitespace-nowrap">Kariyer</span>
				</a>
			</li>
			<li>
				<a
					href="/settings"
					class="flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-DarkLightGrey {($page.url.pathname.startsWith('/settings')) ? 'bg-gray-100 dark:bg-DarkLightGrey' : ''}"
				>
					<svg
						class="w-5 h-5 text-gray-500 dark:text-gray-400"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fill-rule="evenodd"
							d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
							clip-rule="evenodd"
						></path>
					</svg>
					<span class="flex-1 ml-3 whitespace-nowrap">Ayarlar</span>
				</a>
			</li>
		</ul>

		<!-- Profile Link at Bottom -->
		<div class="mt-auto pt-4 border-t border-gray-300 dark:border-DarkLightGrey">
			<a
				href="/profile"
				class="flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-DarkLightGrey {($page.url.pathname.startsWith('/profile')) ? 'bg-gray-100 dark:bg-DarkLightGrey' : ''}"
			>
				<svg
					class="w-5 h-5 text-gray-500 dark:text-gray-400"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						fill-rule="evenodd"
						d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
						clip-rule="evenodd"
					></path>
				</svg>
				<span class="flex-1 ml-3 whitespace-nowrap">Profil</span>
			</a>
		</div>
	</div>
</aside>
