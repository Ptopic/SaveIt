import useGetUserInfo from '@/api/auth/hooks/useGetUserInfo';
import ScreenHeader from '@/components/ScreenHeader';
import EditProfileForm from '@/feature/profile/EditProfileForm';
import { blurhash } from '@/shared/contants';
import { ImageIcon, SwitchIcon } from '@/shared/svgs';
import { getTailwindHexColor } from '@/utils/getTailwindColor';
import { ImageBackground } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
	ActivityIndicator,
	SafeAreaView,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';

const ProfileScreen = () => {
	const [image, setImage] = useState<string | null>(null);
	const [imageBase64, setImageBase64] = useState<string | null>(null);

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			aspect: [16, 9],
			quality: 1,
			base64: true,
		});

		if (!result.canceled && result.assets?.[0]) {
			setImage(result.assets[0].uri ?? null);
			setImageBase64(`data:image/jpeg;base64,${result.assets[0].base64}`);
		}
	};

	const { data: userInfo, isLoading: isUserInfoLoading } = useGetUserInfo();

	return (
		<SafeAreaView>
			<View className="p-4 gap-5">
				<ScreenHeader title="Profile" />

				{isUserInfoLoading ? (
					<ActivityIndicator />
				) : (
					<View className="items-center">
						{userInfo?.picture ? (
							<TouchableOpacity
								className="w-[140] h-[140] rounded-full overflow-hidden"
								onPress={pickImage}
							>
								<ImageBackground
									source={{ uri: userInfo.picture }}
									style={styles.image}
									contentFit="cover"
									placeholder={blurhash}
									transition={500}
								/>
								<View className="absolute bottom-2 left-[50%] -translate-x-[50%]">
									<SwitchIcon
										height={24}
										width={24}
										color="white"
										style={{
											shadowColor: 'black',
											shadowOffset: { width: 0, height: 2 },
											shadowOpacity: 0.4,
											shadowRadius: 5,
											elevation: 5,
										}}
									/>
								</View>
							</TouchableOpacity>
						) : (
							<TouchableOpacity
								className="w-[140] h-[140] rounded-full bg-gray200 justify-center items-center"
								onPress={pickImage}
							>
								<ImageIcon
									height={34}
									width={34}
									color={getTailwindHexColor('black')}
								/>
							</TouchableOpacity>
						)}
					</View>
				)}

				{userInfo ? (
					<EditProfileForm userInfo={userInfo} />
				) : (
					<ActivityIndicator />
				)}
			</View>
		</SafeAreaView>
	);
};

export default ProfileScreen;

const styles = StyleSheet.create({
	image: {
		width: 140,
		height: 140,
		borderRadius: 100,
	},
});
