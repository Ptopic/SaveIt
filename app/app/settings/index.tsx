import ScreenHeader from '@/components/ScreenHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';

export default function SettingsScreen() {
	const handleLogout = async () => {
		await AsyncStorage.removeItem('accessToken');
		router.push('/getStarted');
	};
	return (
		<SafeAreaView>
			<View className="p-[15] gap-[30]">
				<ScreenHeader title="Settings" />

				<Text className="text-lg text-gray-600">Account</Text>
			</View>
		</SafeAreaView>
	);
}
