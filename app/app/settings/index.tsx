import useGetUserInfo from '@/api/auth/hooks/useGetUserInfo';
import DeleteModalContent from '@/components/DeleteModalContent';
import ModalComponent from '@/components/ModalComponent';
import ScreenHeader from '@/components/ScreenHeader';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
	ActivityIndicator,
	SafeAreaView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function SettingsScreen() {
	const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] =
		useState(false);

	const { data: user, isLoading: isUserInfoLoading } = useGetUserInfo();

	const handleLogout = async () => {
		await AsyncStorage.removeItem('accessToken');
		router.push('/getStarted');
	};
	return (
		<SafeAreaView>
			<View className="p-4 gap-5">
				<ScreenHeader title="Settings" />

				{isUserInfoLoading ? (
					<ActivityIndicator />
				) : (
					<View className="gap-5">
						<View className="flex-col gap-3">
							<Text className="heading-xxsmall">Account</Text>

							<View className="flex-col gap-3 bg-gray100 p-3 rounded-lg">
								<TouchableOpacity
									className="p-1 flex-row items-center justify-between"
									onPress={() => router.push('/profile' as any)}
								>
									<View className="flex-row gap-3 items-center">
										<Icon
											name="clipboard-text-outline"
											size={16}
											color="#737373"
										/>
										<Text className="body-small-regular">
											Personal Information
										</Text>
									</View>
									<MaterialIcons name="arrow-forward-ios" size={14} />
								</TouchableOpacity>

								<TouchableOpacity
									className="p-1 flex-row items-center justify-between"
									onPress={() => setIsDeleteAccountModalVisible(true)}
								>
									<View className="flex-row gap-3 items-center">
										<IonIcons name="trash-outline" size={16} color="#b00000" />
										<Text className="body-small-regular text-red600">
											Delete Account
										</Text>
									</View>
									<MaterialIcons name="arrow-forward-ios" size={14} />
								</TouchableOpacity>
							</View>
						</View>

						<View className="flex-col gap-3">
							<Text className="heading-xxsmall">General</Text>

							<View className="flex-col gap-2 bg-gray100 p-3 rounded-lg">
								<TouchableOpacity
									className="p-1 flex-row items-center justify-between"
									onPress={handleLogout}
								>
									<View className="flex-row gap-3 items-center">
										<MaterialIcons name="logout" size={16} color="#b00000" />
										<Text className="body-small-regular text-red600">
											Logout
										</Text>
									</View>
									<MaterialIcons name="arrow-forward-ios" size={14} />
								</TouchableOpacity>
							</View>
						</View>
					</View>
				)}
			</View>
			<ModalComponent
				modalVisible={isDeleteAccountModalVisible}
				setModalVisible={setIsDeleteAccountModalVisible}
			>
				<DeleteModalContent
					setIsModalVisible={setIsDeleteAccountModalVisible}
				/>
			</ModalComponent>
		</SafeAreaView>
	);
}
