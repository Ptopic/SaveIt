import useGetAllLocations from '@/api/locations/hooks/useGetAllLocations';
import { ILocation } from '@/api/locations/types';
import ErrorText from '@/components/ErrorText';
import Search from '@/components/Search';
import Subtitle from '@/components/Subtitle';
import Text from '@/components/Text';
import Title from '@/components/Title';
import useDebounce from '@/hooks/useDebounce';
import { CloseIcon } from '@/shared/svgs';
import { getEmoji, removeEmoji } from '@/utils/emoji';
import { getTailwindHexColor } from '@/utils/getTailwindColor';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
	ActivityIndicator,
	Dimensions,
	FlatList,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function TabMapScreen() {
	const snapPoints = useMemo(() => ['25%', '50%', '70%'], []);
	const insets = useSafeAreaInsets();

	const bottomSheetRef = useRef<BottomSheet>(null);
	const locationDetailsBottomSheetRef = useRef<BottomSheet>(null);

	const { width } = Dimensions.get('window');

	const cardWidth = width - 30;

	const mapRef = useRef<MapView | null>(null);

	const [location, setLocation] = useState<Region | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	const [selectedLocation, setSelectedLocation] = useState<ILocation | null>(
		null
	);

	const [search, setSearch] = useState('');

	const debouncedSearchValue = useDebounce(search, 600);

	const { data: locations, isLoading } = useGetAllLocations({
		searchQuery: debouncedSearchValue,
	});

	useEffect(() => {
		async function getCurrentLocation() {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				setErrorMsg('Permission to access location was denied');
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
			setLocation({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				latitudeDelta: 0.025,
				longitudeDelta: 0.025,
			});
		}

		getCurrentLocation();
	}, []);

	const recenterMap = () => {
		if (location && mapRef.current) {
			mapRef.current.animateToRegion(location, 1000);
		}
	};

	useEffect(() => {
		if (debouncedSearchValue !== '') {
			if (locations?.[0]?.coordinates) {
				mapRef.current?.animateToRegion(
					{
						latitude: parseFloat(locations[0].coordinates.split(',')[0]),
						longitude: parseFloat(locations[0].coordinates.split(',')[1]),
						latitudeDelta: 0.025,
						longitudeDelta: 0.025,
					},
					1000
				);
			}
		}
	}, [locations, debouncedSearchValue]);

	const onLocationPress = (location: ILocation) => {
		bottomSheetRef.current?.close();
		locationDetailsBottomSheetRef.current?.snapToIndex(1);
		mapRef.current?.animateToRegion(
			{
				latitude: parseFloat(location.coordinates.split(',')[0]),
				longitude: parseFloat(location.coordinates.split(',')[1]),
				latitudeDelta: 0.005,
				longitudeDelta: 0.005,
			},
			1000
		);

		setSelectedLocation(location);
	};

	const onLocationDetailsClose = () => {
		locationDetailsBottomSheetRef.current?.close();
		bottomSheetRef.current?.snapToIndex(1);
		setSelectedLocation(null);
	};

	return (
		<View className="flex-1">
			{location && (
				<MapView
					ref={mapRef}
					style={styles.map}
					initialRegion={location}
					showsUserLocation={true}
				>
					{locations?.map((location) => {
						const [lat, lon] = location.coordinates?.split(',') || [];
						if (!lat || !lon) return null;

						return (
							<Marker
								key={location.id}
								coordinate={{
									latitude: parseFloat(lat),
									longitude: parseFloat(lon),
								}}
							>
								<TouchableOpacity
									style={styles.markerContainer}
									onPress={() => onLocationPress(location)}
								>
									<Text style={styles.markerEmoji}>{location.emoji}</Text>
								</TouchableOpacity>
							</Marker>
						);
					})}
				</MapView>
			)}
			{errorMsg && <ErrorText error={errorMsg} />}

			<View className="absolute right-[20]" style={{ top: insets.top + 15 }}>
				<TouchableOpacity
					onPress={recenterMap}
					className="bg-black p-3 rounded-md"
				>
					<Icon name="location-arrow" size={24} color="white" />
				</TouchableOpacity>
			</View>

			<BottomSheet ref={bottomSheetRef} index={1} snapPoints={snapPoints}>
				<BottomSheetView className="flex-1 px-[15] pb-[15]">
					{isLoading ? (
						<ActivityIndicator
							size="large"
							color={getTailwindHexColor('gray400')}
						/>
					) : (
						<View className="flex-1 flex-col gap-4">
							<Search
								placeholder="Search for a location"
								value={search}
								onChangeText={(text) => setSearch(text)}
							/>
							<Title>Locations</Title>
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
						</View>
					)}
				</BottomSheetView>
			</BottomSheet>

			<BottomSheet
				ref={locationDetailsBottomSheetRef}
				index={-1}
				snapPoints={snapPoints}
			>
				<BottomSheetView className="flex-1 px-[15] pb-[15] flex-col gap-4">
					<ScrollView showsVerticalScrollIndicator={false}>
						<View className="flex-row justify-between items-center">
							<View className="w-12 h-12 rounded-full bg-gray50 border border-gray200 items-center justify-center">
								<Text className="text-lg">{selectedLocation?.emoji}</Text>
							</View>
							<TouchableOpacity
								className="bg-red100 rounded-full w-[30] h-[30] justify-center items-center"
								onPress={() => {
									onLocationDetailsClose();
								}}
							>
								<CloseIcon
									width={20}
									height={20}
									color={getTailwindHexColor('red400')}
								/>
							</TouchableOpacity>
						</View>
						<View className="flex-1 flex-col gap-2">
							<Title>{selectedLocation?.name}</Title>
							<Text>
								{selectedLocation?.flag + ' ' + selectedLocation?.city}
							</Text>
							<Text className="text-gray500">{selectedLocation?.address}</Text>
							<View className="flex-row gap-2">
								{selectedLocation?.categories &&
									selectedLocation?.categories.map((category, index) => (
										<View
											key={index}
											className="bg-gray50 border border-gray200 rounded-lg p-2"
										>
											<Text>{category}</Text>
										</View>
									))}
							</View>
							<Text>{selectedLocation?.description}</Text>
							<View className="flex-col gap-4">
								<View className="flex-col gap-2">
									<Subtitle>Highlights</Subtitle>
									<ScrollView
										horizontal
										showsVerticalScrollIndicator={false}
										showsHorizontalScrollIndicator={false}
										decelerationRate="fast"
										snapToInterval={cardWidth + 15}
										snapToAlignment="start"
										contentContainerStyle={{
											alignItems: 'flex-start',
											gap: 10,
										}}
									>
										<View className="flex-row items-stretch gap-2">
											{selectedLocation?.highlights.map((highlight, index) => (
												<View
													key={index}
													className="bg-gray50 border border-gray200 rounded-lg p-4 flex flex-row items-center gap-2"
													style={{ width: cardWidth, flex: 1 }}
												>
													<Text>{getEmoji(highlight)}</Text>
													<Text className="flex-1 flex-wrap">
														{removeEmoji(highlight)}
													</Text>
												</View>
											))}
										</View>
									</ScrollView>
								</View>
								<View className="flex-col gap-2">
									<Subtitle>Tips</Subtitle>
									<ScrollView
										horizontal
										showsVerticalScrollIndicator={false}
										showsHorizontalScrollIndicator={false}
										decelerationRate="fast"
										snapToInterval={cardWidth + 15}
										snapToAlignment="start"
										contentContainerStyle={{
											alignItems: 'flex-start',
											gap: 10,
										}}
									>
										<View className="flex-row items-stretch gap-2">
											{selectedLocation?.tips.map((tip, index) => (
												<View
													key={index}
													style={{ width: cardWidth, flex: 1 }}
													className="bg-gray50 border border-gray200 rounded-lg p-4 flex flex-row items-center gap-2"
												>
													<Text>{getEmoji(tip)}</Text>
													<Text className="flex-1 flex-wrap">
														{removeEmoji(tip)}
													</Text>
												</View>
											))}
										</View>
									</ScrollView>
								</View>
								<View className="flex-col gap-2 bg-gray50 p-3 rounded-lg">
									<Subtitle>Best Time to Visit</Subtitle>
									<View className="flex-row gap-2 items-center">
										<Text className="text-xl">{'🗓️'}</Text>
										<Text>{selectedLocation?.bestTimeToVisit}</Text>
									</View>
								</View>
							</View>
						</View>
					</ScrollView>
				</BottomSheetView>
			</BottomSheet>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	map: {
		width: '100%',
		height: '100%',
	},
	markerContainer: {
		backgroundColor: 'white',
		borderRadius: 25,
		height: 40,
		width: 40,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 3,
		elevation: 5,
	},
	markerEmoji: {
		fontSize: 20,
	},
});
