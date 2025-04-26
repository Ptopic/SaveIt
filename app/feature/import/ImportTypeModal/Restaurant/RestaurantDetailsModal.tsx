import { IRestaurant } from '@/api/imports/types';
import PlaceOrRestaurantDisplay from '@/components/PlaceOrRestaurantDisplay';
import Text from '@/components/Text';
import { CloseIcon } from '@/shared/svgs';
import { getTailwindHexColor } from '@/utils/getTailwindColor';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

interface IProps {
	restaurant: IRestaurant;
	handleCloseModal: () => void;
}

const RestaurantDetailsModal = ({ restaurant, handleCloseModal }: IProps) => {
	const restaurantData = {
		...restaurant,
		...restaurant.importLocation[0],
	};

	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<View className="flex-row justify-between items-center">
				<View className="w-12 h-12 rounded-full bg-gray50 border border-gray200 items-center justify-center">
					<Text className="text-lg">{restaurant?.emoji}</Text>
				</View>
				<TouchableOpacity
					className="bg-red100 rounded-full w-[30] h-[30] justify-center items-center"
					onPress={() => {
						handleCloseModal();
					}}
				>
					<CloseIcon
						width={20}
						height={20}
						color={getTailwindHexColor('red400')}
					/>
				</TouchableOpacity>
			</View>
			<PlaceOrRestaurantDisplay data={restaurantData} />
			<View className="h-[20px]" />
		</ScrollView>
	);
};

export default RestaurantDetailsModal;
