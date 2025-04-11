import {
	BooksIcon,
	EllipsisCircledIcon,
	EventsIcon,
	FilmsIcon,
	PlacesIcon,
	ProductsIcon,
	RecipesIcon,
	RestaurantsIcon,
	SoftwareIcon,
	WorkoutsIcon,
} from '@/shared/svgs';
import { getTailwindHexColor } from '@/utils/getTailwindColor';

export enum ImportType {
	RESTAURANT = 'Restaurant',
	PLACE = 'Place',
	RECIPE = 'Recipe',
	PRODUCT = 'Product',
	EVENT = 'Event',
	WORKOUT = 'Workout',
	BOOK = 'Book',
	FILM = 'Film',
	SOFTWARE = 'Software',
	OTHER = 'Other',
}

export const ImportTypeIcons = {
	[ImportType.RESTAURANT]: RestaurantsIcon,
	[ImportType.PLACE]: PlacesIcon,
	[ImportType.RECIPE]: RecipesIcon,
	[ImportType.PRODUCT]: ProductsIcon,
	[ImportType.EVENT]: EventsIcon,
	[ImportType.WORKOUT]: WorkoutsIcon,
	[ImportType.BOOK]: BooksIcon,
	[ImportType.FILM]: FilmsIcon,
	[ImportType.SOFTWARE]: SoftwareIcon,
	[ImportType.OTHER]: EllipsisCircledIcon,
};

export const ImportTypeBgColors = {
	[ImportType.RESTAURANT]: getTailwindHexColor('yellow100'),
	[ImportType.PLACE]: getTailwindHexColor('blue100'),
	[ImportType.RECIPE]: getTailwindHexColor('orange100'),
	[ImportType.PRODUCT]: getTailwindHexColor('red100'),
	[ImportType.EVENT]: getTailwindHexColor('purple100'),
	[ImportType.WORKOUT]: getTailwindHexColor('green100'),
	[ImportType.BOOK]: getTailwindHexColor('brown100'),
	[ImportType.FILM]: getTailwindHexColor('purple100'),
	[ImportType.SOFTWARE]: getTailwindHexColor('sky100'),
	[ImportType.OTHER]: getTailwindHexColor('gray100'),
};

export const ImportTypeTextColors = {
	[ImportType.RESTAURANT]: getTailwindHexColor('yellow400'),
	[ImportType.PLACE]: getTailwindHexColor('blue400'),
	[ImportType.RECIPE]: getTailwindHexColor('orange400'),
	[ImportType.PRODUCT]: getTailwindHexColor('red400'),
	[ImportType.EVENT]: getTailwindHexColor('purple400'),
	[ImportType.WORKOUT]: getTailwindHexColor('green400'),
	[ImportType.BOOK]: getTailwindHexColor('brown400'),
	[ImportType.FILM]: getTailwindHexColor('purple400'),
	[ImportType.SOFTWARE]: getTailwindHexColor('sky400'),
	[ImportType.OTHER]: getTailwindHexColor('gray400'),
};

const pluralize = (word: string) => {
	return word.endsWith('s') ? word : word + 's';
};

export const ImportTypeOptions = {
	[ImportType.RESTAURANT]: {
		title: pluralize(ImportType.RESTAURANT),
		value: ImportType.RESTAURANT,
		icon: (
			<RestaurantsIcon
				height={16}
				width={16}
				color={getTailwindHexColor('yellow400')}
			/>
		),
		bgColor: ImportTypeBgColors[ImportType.RESTAURANT],
		textColor: ImportTypeTextColors[ImportType.RESTAURANT],
	},
	[ImportType.PLACE]: {
		title: pluralize(ImportType.PLACE),
		value: ImportType.PLACE,
		icon: (
			<PlacesIcon
				height={16}
				width={16}
				color={getTailwindHexColor('blue400')}
				fill={getTailwindHexColor('blue400')}
			/>
		),
		bgColor: ImportTypeBgColors[ImportType.PLACE],
		textColor: ImportTypeTextColors[ImportType.PLACE],
	},
	[ImportType.RECIPE]: {
		title: pluralize(ImportType.RECIPE),
		value: ImportType.RECIPE,
		icon: (
			<RecipesIcon
				height={16}
				width={16}
				color={getTailwindHexColor('orange400')}
				fill={getTailwindHexColor('orange400')}
			/>
		),
		bgColor: ImportTypeBgColors[ImportType.RECIPE],
		textColor: ImportTypeTextColors[ImportType.RECIPE],
	},
	[ImportType.PRODUCT]: {
		title: pluralize(ImportType.PRODUCT),
		value: ImportType.PRODUCT,
		icon: (
			<ProductsIcon
				height={16}
				width={16}
				color={getTailwindHexColor('red400')}
				fill={getTailwindHexColor('red400')}
			/>
		),
		bgColor: ImportTypeBgColors[ImportType.PRODUCT],
		textColor: ImportTypeTextColors[ImportType.PRODUCT],
	},
	[ImportType.EVENT]: {
		title: pluralize(ImportType.EVENT),
		value: ImportType.EVENT,
		icon: (
			<EventsIcon
				height={16}
				width={16}
				color={getTailwindHexColor('purple400')}
			/>
		),
		bgColor: ImportTypeBgColors[ImportType.EVENT],
		textColor: ImportTypeTextColors[ImportType.EVENT],
	},
	[ImportType.WORKOUT]: {
		title: 'Workout Routine',
		value: ImportType.WORKOUT,
		icon: (
			<WorkoutsIcon
				height={16}
				width={16}
				color={getTailwindHexColor('green400')}
				fill={getTailwindHexColor('green400')}
			/>
		),
		bgColor: ImportTypeBgColors[ImportType.WORKOUT],
		textColor: ImportTypeTextColors[ImportType.WORKOUT],
	},
	[ImportType.BOOK]: {
		title: pluralize(ImportType.BOOK),
		value: ImportType.BOOK,
		icon: (
			<BooksIcon
				height={16}
				width={16}
				color={getTailwindHexColor('brown400')}
				fill={getTailwindHexColor('brown400')}
			/>
		),
		bgColor: ImportTypeBgColors[ImportType.BOOK],
		textColor: ImportTypeTextColors[ImportType.BOOK],
	},
	[ImportType.FILM]: {
		title: 'Films & Shows',
		value: ImportType.FILM,
		icon: (
			<FilmsIcon
				height={16}
				width={16}
				color={getTailwindHexColor('purple400')}
			/>
		),
		bgColor: ImportTypeBgColors[ImportType.FILM],
		textColor: ImportTypeTextColors[ImportType.FILM],
	},
	[ImportType.SOFTWARE]: {
		title: ImportType.SOFTWARE,
		value: ImportType.SOFTWARE,
		icon: (
			<SoftwareIcon
				height={16}
				width={16}
				color={getTailwindHexColor('sky400')}
			/>
		),
		bgColor: ImportTypeBgColors[ImportType.SOFTWARE],
		textColor: ImportTypeTextColors[ImportType.SOFTWARE],
	},
	[ImportType.OTHER]: {
		title: ImportType.OTHER,
		value: ImportType.OTHER,
		icon: (
			<EllipsisCircledIcon
				height={16}
				width={16}
				color={getTailwindHexColor('gray400')}
			/>
		),
		bgColor: ImportTypeBgColors[ImportType.OTHER],
		textColor: ImportTypeTextColors[ImportType.OTHER],
	},
};
