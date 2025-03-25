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
				lightgray: '#444444',
				gray500: '#D6D6D6FF',
				gray600: '#B2B3B3',
				darkgray: '#222222',
			},
		},
	},
	plugins: [],
};
