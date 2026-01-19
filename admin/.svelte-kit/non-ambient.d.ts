
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/hashtags" | "/jobs" | "/login" | "/menus" | "/pages" | "/posts" | "/profile" | "/roles" | "/settings" | "/sources" | "/telegram-groups" | "/users";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/hashtags": Record<string, never>;
			"/jobs": Record<string, never>;
			"/login": Record<string, never>;
			"/menus": Record<string, never>;
			"/pages": Record<string, never>;
			"/posts": Record<string, never>;
			"/profile": Record<string, never>;
			"/roles": Record<string, never>;
			"/settings": Record<string, never>;
			"/sources": Record<string, never>;
			"/telegram-groups": Record<string, never>;
			"/users": Record<string, never>
		};
		Pathname(): "/" | "/hashtags" | "/hashtags/" | "/jobs" | "/jobs/" | "/login" | "/login/" | "/menus" | "/menus/" | "/pages" | "/pages/" | "/posts" | "/posts/" | "/profile" | "/profile/" | "/roles" | "/roles/" | "/settings" | "/settings/" | "/sources" | "/sources/" | "/telegram-groups" | "/telegram-groups/" | "/users" | "/users/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}