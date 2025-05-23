import useGetAllLocationsOnScroll from '@/api/locations/hooks/useGetAllLocations';
import { ILocation } from '@/api/locations/types';
import ErrorText from '@/components/ErrorText';
import Search from '@/components/Search';
import Text from '@/components/Text';
import Title from '@/components/Title';
import LocationDisplayModal from '@/feature/map/LocationDisplayModal';
import LocationsList from '@/feature/map/LocationsList';
import useDebounce from '@/hooks/useDebounce';
import { LOCATIONS_PAGE_SIZE } from '@/shared/pagination';
import { getTailwindHexColor } from '@/utils/getTailwindColor';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	ActivityIndicator,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function TabMapScreen() {
	const snapPoints = useMemo(() => ['25%', '50%', '70%'], []);
	const locationSnapPoints = useMemo(() => ['25%', '70%'], []);
	const insets = useSafeAreaInsets();

	const bottomSheetRef = useRef<BottomSheet>(null);
	const locationDetailsBottomSheetRef = useRef<BottomSheet>(null);

	const mapRef = useRef<MapView | null>(null);

	const [location, setLocation] = useState<Region | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	const [selectedLocation, setSelectedLocation] = useState<ILocation | null>(
		null
	);

	const [search, setSearch] = useState('');

	const debouncedSearchValue = useDebounce(search, 600);

	const {
		locations,
		isLoading,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		refetch: refetchLocations,
	} = useGetAllLocationsOnScroll({
		pageSize: LOCATIONS_PAGE_SIZE,
		searchQuery: debouncedSearchValue,
	});

	const handleEndReached = useCallback(() => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	useEffect(() => {
		async function getCurrentLocation() {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				setErrorMsg('Permission to access location was denied');
				return;
			}

			let currentLocation = await Location.getCurrentPositionAsync({});
			if (currentLocation) {
				setLocation({
					latitude: currentLocation.coords.latitude,
					longitude: currentLocation.coords.longitude,
					latitudeDelta: 0.025,
					longitudeDelta: 0.025,
				});
			}
		}

		getCurrentLocation();
	}, []);

	const recenterMap = () => {
		if (location && mapRef.current) {
			mapRef.current.animateToRegion(location, 1000);
		}
	};

	useEffect(() => {
		if (debouncedSearchValue !== '' && locations?.[0]?.coordinates) {
			const [lat, lon] = locations[0].coordinates.split(',');
			if (lat && lon) {
				mapRef.current?.animateToRegion(
					{
						latitude: parseFloat(lat),
						longitude: parseFloat(lon),
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
					{selectedLocation !== null && (
						<Marker
							key={selectedLocation.id}
							coordinate={{
								latitude: parseFloat(
									selectedLocation.coordinates.split(',')[0]
								),
								longitude: parseFloat(
									selectedLocation.coordinates.split(',')[1]
								),
							}}
						>
							<TouchableOpacity
								style={styles.markerContainer}
								onPress={() => onLocationPress(selectedLocation)}
							>
								<Text>{selectedLocation.emoji}</Text>
							</TouchableOpacity>
						</Marker>
					)}
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
									<Text>{location.emoji}</Text>
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
					activeOpacity={1}
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
							{locations && locations.length > 0 ? (
								<LocationsList
									locations={locations}
									onLocationPress={onLocationPress}
									hasNextPage={hasNextPage}
									handleEndReached={handleEndReached}
									refreshing={isFetchingNextPage}
									onRefresh={refetchLocations}
									isFetchingNextPage={isFetchingNextPage}
								/>
							) : (
								<Text>No locations found</Text>
							)}
						</View>
					)}
				</BottomSheetView>
			</BottomSheet>

			<BottomSheet
				ref={locationDetailsBottomSheetRef}
				index={-1}
				snapPoints={locationSnapPoints}
			>
				<BottomSheetView className="flex-1 px-[15] pb-[15] flex-col gap-4">
					{selectedLocation && (
						<LocationDisplayModal
							selectedLocation={selectedLocation}
							onLocationDetailsClose={onLocationDetailsClose}
						/>
					)}
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
});
