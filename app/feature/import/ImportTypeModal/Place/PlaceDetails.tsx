import { IPlace, IRestaurant } from '@/api/imports/types';
import PlaceOrRestaurantDisplay from '@/components/ContentTypeDisplays/PlaceOrRestaurantDisplay';
import Text from '@/components/Text';
import { CloseIcon } from '@/shared/svgs';
import { getTailwindHexColor } from '@/utils/getTailwindColor';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

interface IProps {
	place: IPlace | IRestaurant;
	handleCloseModal: () => void;
}

const PlaceDetails = ({ place, handleCloseModal }: IProps) => {
	const placeData = {
		...place,
		...place.importLocation[0],
	};

	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<View className="flex-row justify-between items-center">
				<View className="w-12 h-12 rounded-full bg-gray50 border border-gray200 items-center justify-center">
					<Text className="text-lg">{place?.emoji}</Text>
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
			<PlaceOrRestaurantDisplay data={placeData} />
			<View className="h-[20px]" />
		</ScrollView>
	);
};

export default PlaceDetails;
