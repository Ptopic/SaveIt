import {
	BooksIcon,
	CloseIcon,
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
import { ScrollView, TouchableOpacity } from 'react-native';
import FilterBadge from './FilterBadge';

interface IProps {
	activeFilter: string;
	setActiveFilter: (filter: string) => void;
}

const FiltersToolbar = ({ activeFilter, setActiveFilter }: IProps) => {
	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={{ gap: 10 }}
		>
			{activeFilter && (
				<TouchableOpacity
					className="flex items-center justify-center"
					onPress={() => setActiveFilter('')}
				>
					<CloseIcon
						height={24}
						width={24}
						color={getTailwindHexColor('gray700')}
					/>
				</TouchableOpacity>
			)}
			<FilterBadge
				title="Restaurants"
				icon={
					<RestaurantsIcon
						height={16}
						width={16}
						color={getTailwindHexColor('yellow400')}
					/>
				}
				bgColor="yellow100"
				textColor="yellow400"
				activeFilter={activeFilter}
				setActiveFilter={setActiveFilter}
			/>
			<FilterBadge
				title="Places"
				icon={
					<PlacesIcon
						height={16}
						width={16}
						color={getTailwindHexColor('blue400')}
						fill={getTailwindHexColor('blue400')}
					/>
				}
				bgColor="blue100"
				textColor="blue400"
				activeFilter={activeFilter}
				setActiveFilter={setActiveFilter}
			/>
			<FilterBadge
				title="Recipes"
				icon={
					<RecipesIcon
						height={16}
						width={16}
						color={getTailwindHexColor('orange400')}
						fill={getTailwindHexColor('orange400')}
					/>
				}
				bgColor="orange100"
				textColor="orange400"
				activeFilter={activeFilter}
				setActiveFilter={setActiveFilter}
			/>
			<FilterBadge
				title="Products"
				icon={
					<ProductsIcon
						height={16}
						width={16}
						color={getTailwindHexColor('red400')}
						fill={getTailwindHexColor('red400')}
					/>
				}
				bgColor="red100"
				textColor="red400"
				activeFilter={activeFilter}
				setActiveFilter={setActiveFilter}
			/>
			<FilterBadge
				title="Events"
				icon={
					<EventsIcon
						height={16}
						width={16}
						color={getTailwindHexColor('purple400')}
					/>
				}
				bgColor="purple100"
				textColor="purple400"
				activeFilter={activeFilter}
				setActiveFilter={setActiveFilter}
			/>
			<FilterBadge
				title="Workout Routines"
				icon={
					<WorkoutsIcon
						height={16}
						width={16}
						color={getTailwindHexColor('green400')}
						fill={getTailwindHexColor('green400')}
					/>
				}
				bgColor="green100"
				textColor="green400"
				activeFilter={activeFilter}
				setActiveFilter={setActiveFilter}
			/>
			<FilterBadge
				title="Books"
				icon={
					<BooksIcon
						height={16}
						width={16}
						color={getTailwindHexColor('brown400')}
						fill={getTailwindHexColor('brown400')}
					/>
				}
				bgColor="brown100"
				textColor="brown400"
				activeFilter={activeFilter}
				setActiveFilter={setActiveFilter}
			/>
			<FilterBadge
				title="Films and Shows"
				icon={
					<FilmsIcon
						height={16}
						width={16}
						color={getTailwindHexColor('purple400')}
					/>
				}
				bgColor="purple100"
				textColor="purple400"
				activeFilter={activeFilter}
				setActiveFilter={setActiveFilter}
			/>
			<FilterBadge
				title="Software"
				icon={
					<SoftwareIcon
						height={16}
						width={16}
						color={getTailwindHexColor('sky400')}
					/>
				}
				bgColor="sky100"
				textColor="sky400"
				activeFilter={activeFilter}
				setActiveFilter={setActiveFilter}
			/>
			<FilterBadge
				title="Other"
				icon={
					<EllipsisCircledIcon
						height={16}
						width={16}
						color={getTailwindHexColor('sky400')}
					/>
				}
				bgColor="sky100"
				textColor="sky400"
				activeFilter={activeFilter}
				setActiveFilter={setActiveFilter}
			/>
		</ScrollView>
	);
};

export default FiltersToolbar;
