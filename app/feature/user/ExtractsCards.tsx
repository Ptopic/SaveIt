import ExtractCard from '@/components/ExtractCard';
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
import { ScrollView } from 'react-native';

const ExtractsCards = () => {
	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={{ gap: 10 }}
		>
			<ExtractCard
				title="Restaurants"
				icon={
					<RestaurantsIcon
						height={18}
						width={18}
						color={getTailwindHexColor('yellow400')}
					/>
				}
				bgColor="yellow100"
				textColor="yellow400"
				url="/category/restaurants"
			/>
			<ExtractCard
				title="Places"
				icon={
					<PlacesIcon
						height={20}
						width={20}
						color={getTailwindHexColor('blue400')}
						fill={getTailwindHexColor('blue400')}
					/>
				}
				bgColor="blue100"
				textColor="blue400"
				url="/category/places"
			/>
			<ExtractCard
				title="Recipes"
				icon={
					<RecipesIcon
						height={20}
						width={20}
						color={getTailwindHexColor('orange400')}
						fill={getTailwindHexColor('orange400')}
					/>
				}
				bgColor="orange100"
				textColor="orange400"
				url="/category/recipes"
			/>
			<ExtractCard
				title="Products"
				icon={
					<ProductsIcon
						height={20}
						width={20}
						color={getTailwindHexColor('red400')}
						fill={getTailwindHexColor('red400')}
					/>
				}
				bgColor="red100"
				textColor="red400"
				url="/category/products"
			/>
			<ExtractCard
				title="Events"
				icon={
					<EventsIcon
						height={20}
						width={20}
						color={getTailwindHexColor('purple400')}
					/>
				}
				bgColor="purple100"
				textColor="purple400"
				url="/category/events"
			/>
			<ExtractCard
				title="Workout Routines"
				icon={
					<WorkoutsIcon
						height={20}
						width={20}
						color={getTailwindHexColor('green400')}
						fill={getTailwindHexColor('green400')}
					/>
				}
				bgColor="green100"
				textColor="green400"
				url="/category/workout-routines"
			/>
			<ExtractCard
				title="Books"
				icon={
					<BooksIcon
						height={20}
						width={20}
						color={getTailwindHexColor('brown400')}
						fill={getTailwindHexColor('brown400')}
					/>
				}
				bgColor="brown100"
				textColor="brown400"
				url="/category/books"
			/>
			<ExtractCard
				title="Films and Shows"
				icon={
					<FilmsIcon
						height={20}
						width={20}
						color={getTailwindHexColor('purple400')}
					/>
				}
				bgColor="purple100"
				textColor="purple400"
				url="/category/films-and-shows"
			/>
			<ExtractCard
				title="Software"
				icon={
					<SoftwareIcon
						height={20}
						width={20}
						color={getTailwindHexColor('sky400')}
					/>
				}
				bgColor="sky100"
				textColor="sky400"
				url="/category/software"
			/>
			<ExtractCard
				title="Other"
				icon={
					<EllipsisCircledIcon
						width={20}
						height={20}
						color={getTailwindHexColor('sky400')}
					/>
				}
				bgColor="sky100"
				textColor="sky400"
				url="/category/other"
			/>
		</ScrollView>
	);
};

export default ExtractsCards;
