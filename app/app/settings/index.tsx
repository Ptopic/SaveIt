import Title from '@/components/Title';
import { goBack } from '@/utils/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity } from 'react-native';

export default function SettingsScreen() {
	const handleLogout = async () => {
		await AsyncStorage.removeItem('accessToken');
		router.push('/getStarted');
	};
	return (
		<SafeAreaView className="flex-1 items-center justify-center">
			<Title>Tab One</Title>
			<TouchableOpacity onPress={handleLogout}>
				<Text>Logout</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={goBack}>
				<Text>Back</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
}
