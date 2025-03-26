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
				gray100: '#D2DCDF',
				gray200: '#B4C4CA',
				gray300: '#97ADB5',
				gray400: '#7995A0',
				gray500: '#5F7C86',
				gray600: '#3F535A',
				gray700: '#2A373C',
				gray800: '#20292D',
				gray900: '#151C1E',
			},
		},
	},
	plugins: [],
};
