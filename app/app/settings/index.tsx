import useGetUserInfo from '@/api/auth/hooks/useGetUserInfo';
import ScreenHeader from '@/components/ScreenHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React from 'react';
import {
	ActivityIndicator,
	SafeAreaView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

export default function SettingsScreen() {
	const { data: user, isLoading: isUserInfoLoading } = useGetUserInfo();

	const handleLogout = async () => {
		await AsyncStorage.removeItem('accessToken');
		router.push('/getStarted');
	};
	return (
		<SafeAreaView>
			<View className="p-[15] gap-[30]">
				<ScreenHeader title="Settings" />

				{isUserInfoLoading ? (
					<ActivityIndicator />
				) : (
					<View className="gap-[15]">
						<Text className="text-lg text-gray-600">Account</Text>

						<View className="flex-row items-center justify-between">
							<Text className="text-lg text-gray-600">Email</Text>
							<Text className="text-lg text-gray-600">{user?.email}</Text>
						</View>

						<TouchableOpacity onPress={handleLogout}>
							<Text className="text-lg text-red-500 font-bold text-center">
								Logout
							</Text>
						</TouchableOpacity>
					</View>
				)}
			</View>
		</SafeAreaView>
	);
}
