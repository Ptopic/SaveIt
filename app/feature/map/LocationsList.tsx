import { ILocation } from '@/api/locations/types';
import Text from '@/components/Text';
import {
	ActivityIndicator,
	FlatList,
	RefreshControl,
	TouchableOpacity,
	View,
} from 'react-native';

interface IProps {
	locations: ILocation[];
	onLocationPress: (location: ILocation) => void;
	hasNextPage: boolean;
	handleEndReached: () => void;
	refreshing: boolean;
	onRefresh: () => void;
	isFetchingNextPage: boolean;
}

const LocationsList = ({
	locations,
	onLocationPress,
	hasNextPage,
	handleEndReached,
	refreshing,
	onRefresh,
	isFetchingNextPage,
}: IProps) => {
	return (
		<FlatList
			data={locations}
			contentContainerStyle={{ gap: 10 }}
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={onRefresh}
					colors={['black']}
				/>
			}
			onScroll={({ nativeEvent }) => {
				const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
				const paddingToBottom = 50;
				const isCloseToBottom =
					layoutMeasurement.height + contentOffset.y >=
					contentSize.height - paddingToBottom;

				if (isCloseToBottom) {
					handleEndReached();
				}
			}}
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
		>
			{isFetchingNextPage && (
				<View className="w-full items-center py-4">
					<ActivityIndicator size="large" />
				</View>
			)}

			{hasNextPage && <View style={{ width: '100%', height: 100 }} />}
		</FlatList>
	);
};

export default LocationsList;
