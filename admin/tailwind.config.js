import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./src/routes/**/*.{svelte,ts}',
		'./src/lib/**/*.{svelte,ts}'
	],
	theme: {
		extend: {
			colors: {
				dark: '#000000',
				eksiContent: '#f5f5f5',
				eksiCodeLight: '#D6F9DD',
				eksiCode: '#82BD4E',
				eksiCodeMedium: '#7cb24c',
				eksiCodeDark: '#60695C',
				DarkLightGrey: '#353b43',
				DarkGrey: '#2d2d2d',
				DarkerGrey: '#262626'
			},
			fontFamily: {
				eksifont: ['Montserrat', 'sans-serif']
			}
		}
	},
	plugins: [typography],
	darkMode: 'class'
};
