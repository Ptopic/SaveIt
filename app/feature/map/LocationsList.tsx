import { ILocation } from '@/api/locations/types';
import Text from '@/components/Text';
import { FlatList, TouchableOpacity, View } from 'react-native';

interface IProps {
	locations: ILocation[];
	onLocationPress: (location: ILocation) => void;
}

const LocationsList = ({ locations, onLocationPress }: IProps) => {
	return (
		<FlatList
			data={locations}
			contentContainerStyle={{ gap: 10 }}
			renderItem={({ item }) => (
				<TouchableOpacity onPress={() => onLocationPress(item)}>
					<View className="flex-row gap-3 items-center">
						<View className="w-10 h-10 rounded-full bg-gray100 border border-gray200 items-center justify-center">
							<Text className="text-md">{item.emoji}</Text>
						</View>
						<Text className="body-large-regular">{item.name}</Text>
					</View>
				</TouchableOpacity>
			)}
		/>
	);
};

export default LocationsList;
