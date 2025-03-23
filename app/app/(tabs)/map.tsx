import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function TabMapScreen() {
	const snapPoints = useMemo(() => ['25%', '50%', '70%'], []);
	const insets = useSafeAreaInsets();
	const bottomSheetRef = useRef<BottomSheet>(null);
	const mapRef = useRef<MapView | null>(null);

	const [location, setLocation] = useState<Region | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

	return (
		<View style={styles.container}>
			{location && (
				<MapView
					ref={mapRef}
					style={styles.map}
					initialRegion={location}
					showsUserLocation={true}
				>
					<Marker
						coordinate={{
							latitude: location.latitude,
							longitude: location.longitude,
						}}
					/>
				</MapView>
			)}
			{errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

			<View style={{ ...styles.recenterButtonContainer, top: insets.top + 15 }}>
				<TouchableOpacity onPress={recenterMap} style={styles.recenterButton}>
					<Icon name="location-arrow" size={24} color="white" />
				</TouchableOpacity>
			</View>

			{/* Bottom Sheet */}
			<BottomSheet ref={bottomSheetRef} index={0} snapPoints={snapPoints}>
				<BottomSheetView style={styles.contentContainer}>
					<Text>Locations</Text>
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
	errorText: {
		color: 'red',
		marginTop: 10,
	},
	contentContainer: {
		flex: 1,
		padding: 15,
	},
	recenterButtonContainer: {
		position: 'absolute',
		right: 20,
	},
	recenterButton: {
		backgroundColor: 'black',
		paddingVertical: 12,
		paddingHorizontal: 12,
		borderRadius: 5,
		elevation: 5,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
});
