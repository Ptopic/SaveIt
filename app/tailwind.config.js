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
				gray100: '#f0f0f0',
				gray200: '#e5e5e5',
				gray300: '#d4d4d4',
				gray400: '#a3a3a3',
				gray500: '#737373',
				gray600: '#525252',
				gray700: '#404040',
				gray800: '#1D1818FF',
				gray900: '#171717',
				gray950: '#0a0a0a',

				red50: '#FCE8EC',
				red100: '#F7BAC4',
				red200: '#F28D9E',
				red300: '#ED5E76',
				red400: '#E8314F',
				red500: '#E01C48',
				red600: '#b00000',
				red700: '#5C0A18',
				red800: '#450812',
				red900: '#2E050C',
			},
		},
	},
	plugins: [],
};
