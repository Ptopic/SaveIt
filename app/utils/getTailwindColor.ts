import tailwindConfig from '@/tailwind.config';
import resolveConfig from 'tailwindcss/resolveConfig';

export const getTailwindHexColor = (color: string) => {
	const fullConfig = resolveConfig(tailwindConfig);
	const colors = fullConfig.theme.colors as unknown as Record<string, string>;

	return colors[color];
};
