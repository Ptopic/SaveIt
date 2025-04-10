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
import React from 'react';

interface IProps {
	type: string;
}

const ImportTypeIcon = ({ type }: IProps) => {
	switch (type) {
		case 'Restaurant':
			return (
				<RestaurantsIcon
					height={16}
					width={16}
					color={getTailwindHexColor('yellow400')}
				/>
			);
		case 'Place':
			return (
				<PlacesIcon
					height={16}
					width={16}
					color={getTailwindHexColor('blue400')}
					fill={getTailwindHexColor('blue400')}
				/>
			);
		case 'Recipe':
			return (
				<RecipesIcon
					height={16}
					width={16}
					color={getTailwindHexColor('orange400')}
					fill={getTailwindHexColor('orange400')}
				/>
			);
		case 'Product':
			return (
				<ProductsIcon
					height={16}
					width={16}
					color={getTailwindHexColor('red400')}
					fill={getTailwindHexColor('red400')}
				/>
			);
		case 'Event':
			return (
				<EventsIcon
					height={16}
					width={16}
					color={getTailwindHexColor('purple400')}
				/>
			);
		case 'Workout':
			return (
				<WorkoutsIcon
					height={16}
					width={16}
					color={getTailwindHexColor('green400')}
					fill={getTailwindHexColor('green400')}
				/>
			);
		case 'Book':
			return (
				<BooksIcon
					height={16}
					width={16}
					color={getTailwindHexColor('brown400')}
					fill={getTailwindHexColor('brown400')}
				/>
			);
		case 'Film':
			return (
				<FilmsIcon
					height={16}
					width={16}
					color={getTailwindHexColor('purple400')}
				/>
			);
		case 'Show':
			return (
				<FilmsIcon
					height={16}
					width={16}
					color={getTailwindHexColor('purple400')}
				/>
			);
		case 'Software':
			return (
				<SoftwareIcon
					height={16}
					width={16}
					color={getTailwindHexColor('sky400')}
				/>
			);
		default:
			return (
				<EllipsisCircledIcon
					height={16}
					width={16}
					color={getTailwindHexColor('sky400')}
				/>
			);
	}
};

export default ImportTypeIcon;
