import Title from '@/components/Title';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function TabOneScreen() {
	useEffect(() => {
		const getAccessToken = async () => {
			const accessToken = await AsyncStorage.getItem('accessToken');

			if (!accessToken) {
				router.navigate('/getStarted' as any);
			}
		};
		getAccessToken();
	}, []);

	return (
		<View className="flex-1 items-center justify-center bg-white">
			<Title>Tab One</Title>
		</View>
	);
}
