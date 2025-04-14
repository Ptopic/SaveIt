import { getQueryClient } from '@/shared/queryClient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { Alert, Linking, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { CustomToastProvider } from '@/utils/toast';
import { OneSignal } from 'react-native-onesignal';
import '../global.css';
export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
	initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
		...FontAwesome.font,
	});

	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return <RootLayoutNav />;
}

const queryClient = getQueryClient();

function RootLayoutNav() {
	const [accessToken, setAccessToken] = React.useState<string | null>(null);
	const [isLoading, setIsLoading] = React.useState(true);

	useEffect(() => {
		const getToken = async () => {
			const token = await AsyncStorage.getItem('accessToken');

			setIsLoading(false);
			setAccessToken(token);
		};

		getToken();
	}, []);

	useEffect(() => {
		if (isLoading) return;

		if (!accessToken) {
			OneSignal.logout();
			router.navigate('/getStarted' as any);
		} else {
			// PROD: router.navigate('/' as any);
			router.navigate('/' as any);
		}
	}, [accessToken, isLoading]);

	useEffect(() => {
		const handleDeepLink = (event: any) => {
			const { url } = event;
			if (url && url.startsWith('saveit://')) {
				Alert.alert('App Opened with custom URL', url);
			}
		};

		const subscription = Linking.addEventListener('url', handleDeepLink);

		return () => {
			subscription.remove();
		};
	}, []);

	return (
		<CustomToastProvider>
			<QueryClientProvider client={queryClient}>
				<StatusBar barStyle="dark-content" backgroundColor="white" />
				<GestureHandlerRootView>
					<Stack
						screenOptions={{
							headerShown: false,
							contentStyle: { backgroundColor: 'white' },
						}}
					>
						<Stack.Screen name="(tabs)" />
						<Stack.Screen name="settings/index" />
						<Stack.Screen name="profile/index" />
						<Stack.Screen name="collection/[id]" />
						<Stack.Screen name="collections/index" />
						<Stack.Screen name="category/[slug]" />
						<Stack.Screen name="getStarted/index" />
					</Stack>
				</GestureHandlerRootView>
			</QueryClientProvider>
		</CustomToastProvider>
	);
}
