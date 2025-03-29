import ModalComponent from '@/components/ModalComponent';
import Text from '@/components/Text';
import Title from '@/components/Title';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	SafeAreaView,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';

const googleClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.16:3002';

const index = () => {
	const queryClient = useQueryClient();
	const [modalVisible, setModalVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
		clientId: googleClientId,
		iosClientId: iosClientId,
		androidClientId: androidClientId,
		redirectUri: makeRedirectUri({
			native: 'com.petartopic.Saveit:/oauth2redirect/google',
			scheme: 'Saveit',
		}),
	});

	useEffect(() => {
		const handleAuthResponse = async () => {
			if (response?.type === 'success') {
				const { access_token } = response.params;

				try {
					const apiResponse = await fetch(`${apiUrl}/auth/google`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ token: access_token }),
					});

					const data = await apiResponse.json();
					if (data.token) {
						await queryClient.clear();
						await AsyncStorage.setItem('accessToken', data.token);
						setModalVisible(false);
						router.push('/');
					} else {
						Alert.alert('Error', 'Authentication failed.');
					}
				} catch (error) {
					Alert.alert('Error', 'An error occurred while exchanging the code.');
				}
			}
		};
		handleAuthResponse();
	}, [response]);

	return (
		<SafeAreaView className="flex-1 gap-[20]">
			<View className="flex-1 bg-gray400 items-center justify-center">
				<Text className="text-2xl font-bold">Video</Text>
			</View>

			<View className="items-center justify-center px-[15]">
				<TouchableOpacity
					className="w-full h-[50] bg-black rounded-lg items-center justify-center"
					onPress={() => setModalVisible(true)}
				>
					<Text className="text-white text-lg font-bold">Get Started</Text>
				</TouchableOpacity>
			</View>

			<ModalComponent
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
				overlayStyle={styles.modalOverlay}
				modalStyle={styles.modalContainer}
			>
				<View className="gap-[10]">
					<Title>Sign in with Google</Title>
					<TouchableOpacity
						className="w-full h-[50] bg-black rounded-lg items-center justify-center"
						onPress={() => promptAsync()}
						disabled={!request || isLoading}
					>
						{isLoading ? (
							<ActivityIndicator color="white" />
						) : (
							<Text className="text-white text-lg font-bold">
								Sign in with Google
							</Text>
						)}
					</TouchableOpacity>
				</View>
			</ModalComponent>
		</SafeAreaView>
	);
};

export default index;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		gap: 20,
	},
	content: {
		flex: 1,
		backgroundColor: 'gray400',
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
	},
	button: {
		width: '80%',
		height: 50,
		backgroundColor: 'black',
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
	modalOverlay: {
		justifyContent: 'flex-end',
	},
	modalContainer: {
		width: '100%',
		borderRadius: 10,
		paddingHorizontal: 20,
		paddingTop: 20,
		paddingBottom: 40,
	},
	modalContent: {
		gap: 20,
	},
});
