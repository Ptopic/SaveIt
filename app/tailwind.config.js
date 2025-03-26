/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./app/**/*.{js,jsx,ts,tsx}',
		'./components/**/*.{js,jsx,ts,tsx}',
		'./feature/**/*.{js,jsx,ts,tsx}',
	],
	presets: [require('nativewind/preset')],
	theme: {
		extend: {
			colors: {
				white: '#FFFFFF',
				black: '#0D1011',
				gray25: '#F9FAFB',
				gray50: '#F0F3F4',
				gray100: '#f5f5f5',
				gray200: '#e5e5e5',
				gray300: '#d4d4d4',
				gray400: '#a3a3a3',
				gray500: '#737373',
				gray600: '#525252',
				gray700: '#404040',
				gray800: '#262626',
				gray900: '#171717',
				gray950: '#0a0a0a',
			},
		},
	},
	plugins: [],
};
