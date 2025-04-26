import { IRestaurant } from '@/api/imports/types';
import Text from '@/components/Text';
import { ImageBackground } from 'expo-image';
import { TouchableOpacity, View } from 'react-native';

interface IProps {
	restaurant: IRestaurant;
	width: number;
	onPress: () => void;
}

const RestaurantCard = ({ restaurant, width, onPress }: IProps) => {
	return restaurant?.photo ? (
		<TouchableOpacity
			onPress={onPress}
			activeOpacity={1}
			className="rounded-lg overflow-hidden"
		>
			<ImageBackground
				source={{ uri: restaurant.photo }}
				style={{ width: width, height: 200 }}
				className="rounded-lg overflow-hidden"
			>
				<View className="rounded-lg bg-black/30 p-4 flex-col flex gap-4 overflow-hidden h-[200px]">
					<Text className="heading-xsmall text-white">
						{restaurant.emoji} {restaurant.name}
					</Text>
					<View className="bg-gray300 w-full h-[1px]" />
					<Text className="body-small-regular text-white" numberOfLines={6}>
						{restaurant.description}
					</Text>
				</View>
			</ImageBackground>
		</TouchableOpacity>
	) : (
		<TouchableOpacity
			onPress={onPress}
			style={{ width }}
			className="justify-start h-[200px] bg-gray50 border border-gray200 rounded-lg p-4 flex flex-col gap-4"
			activeOpacity={1}
		>
			<Text className="heading-xsmall">
				{restaurant.emoji} {restaurant.name}
			</Text>
			<View className="bg-gray300 w-full h-[1px]" />
			<Text className="body-small-regular" numberOfLines={2}>
				{restaurant.description}
			</Text>
		</TouchableOpacity>
	);
};

export default RestaurantCard;
