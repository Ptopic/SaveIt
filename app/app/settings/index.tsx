import useGetUserInfo from '@/api/auth/hooks/useGetUserInfo';
import ScreenHeader from '@/components/ScreenHeader';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
					<View className="gap-[10]">
						<Text className="heading-xxsmall">Account</Text>

						<View className="flex-col gap-[10] bg-gray200 p-3 rounded-md">
							<TouchableOpacity className="p-1 flex-row items-center justify-between">
								<View className="flex-row gap-[10] items-center">
									<Icon name="clipboard-text-outline" size={20} color="black" />
									<Text className="body-small-regular">
										Personal Information
									</Text>
								</View>
								<MaterialIcons
									name="arrow-forward-ios"
									size={14}
									color="black"
								/>
							</TouchableOpacity>

							<TouchableOpacity className="p-1 flex-row items-center justify-between">
								<Text className="body-small-regular text-red-500">
									Delete Account
								</Text>
							</TouchableOpacity>
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
