import DeleteModalContent from '@/components/DeleteModalContent';
import ModalComponent from '@/components/ModalComponent';
import ScreenHeader from '@/components/ScreenHeader';
import Text from '@/components/Text';
import {
	ChevronRightIcon,
	LogoutIcon,
	TrashIcon,
	UserCircleIcon,
} from '@/shared/svgs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
	const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] =
		useState(false);

	const handleLogout = async () => {
		await AsyncStorage.removeItem('accessToken');
		router.push('/getStarted');
	};
	return (
		<SafeAreaView>
			<View className="p-4 gap-5">
				<ScreenHeader title="Settings" />

				<View className="gap-5">
					<View className="flex-col gap-3">
						<Text className="heading-xxsmall">Account</Text>

						<View className="flex-col gap-3 bg-gray100 p-3 rounded-lg">
							<TouchableOpacity
								className="p-1 flex-row items-center justify-between"
								onPress={() => router.push('/profile' as any)}
							>
								<View className="flex-row gap-3 items-center">
									<UserCircleIcon width={18} height={18} color="#737373" />
									<Text className="body-small-regular">
										Personal Information
									</Text>
								</View>
								<ChevronRightIcon width={18} height={18} color="#000000" />
							</TouchableOpacity>

							<TouchableOpacity
								className="p-1 flex-row items-center justify-between"
								onPress={() => setIsDeleteAccountModalVisible(true)}
							>
								<View className="flex-row gap-3 items-center">
									<TrashIcon width={18} height={18} color="#b00000" />
									<Text className="body-small-regular text-red600">
										Delete Account
									</Text>
								</View>
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
									<LogoutIcon width={18} height={18} color="#b00000" />
									<Text className="body-small-regular text-red600">Logout</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
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
