import { IRestaurant } from '@/api/imports/types';
import { getDeviceWidth } from '@/utils/device';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import RestaurantCard from './RestaurantCard';

interface IProps {
	restaurants: IRestaurant[];
	handleItemPress: (item: any) => void;
}

const cardWidth = getDeviceWidth() - 40;

const RestaurantsDIsplay = ({ restaurants, handleItemPress }: IProps) => {
	return (
		<ScrollView
			horizontal
			showsVerticalScrollIndicator={false}
			showsHorizontalScrollIndicator={false}
			decelerationRate="fast"
			snapToInterval={cardWidth + 10}
			snapToAlignment="start"
			contentContainerStyle={{
				alignItems: 'flex-start',
				gap: 10,
			}}
		>
			{restaurants.map((restaurant) => (
				<RestaurantCard
					key={restaurant.id}
					restaurant={restaurant}
					width={cardWidth}
					onPress={() => handleItemPress(restaurant)}
				/>
			))}
		</ScrollView>
	);
};

export default RestaurantsDIsplay;
