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

import authRequests from '@/api/auth/requests';
import collectionRequests from '@/api/collection/requests';
import { COLLECTIONS, USER_INFO } from '@/api/constants';
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

function RootLayoutNav() {
	const queryClient = getQueryClient();
	const [accessToken, setAccessToken] = React.useState<string | null>(null);
	const [isLoading, setIsLoading] = React.useState(true);

	const prefetchCommonQueries = React.useCallback(async () => {
		// Example prefetch queries - adjust these based on your actual API endpoints
		await Promise.all([
			queryClient.prefetchQuery({
				queryKey: [COLLECTIONS],
				queryFn: () => collectionRequests.getCollections(),
			}),
			queryClient.prefetchQuery({
				queryKey: [USER_INFO],
				queryFn: () => authRequests.me(),
			}),
		]);
	}, [queryClient]);

	useEffect(() => {
		if (accessToken && !isLoading) {
			prefetchCommonQueries();
		}
	}, [accessToken, isLoading, prefetchCommonQueries]);

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
			router.navigate('/getStarted' as any);
		} else {
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

		Linking.addEventListener('url', handleDeepLink);

		return () => {
			Linking.removeAllListeners('url');
		};
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<StatusBar barStyle="dark-content" backgroundColor="white" />
			<GestureHandlerRootView>
				<Stack>
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					<Stack.Screen
						name="settings/index"
						options={{
							headerShown: false,
						}}
					/>
					<Stack.Screen
						name="profile/index"
						options={{
							headerShown: false,
						}}
					/>
					<Stack.Screen
						name="collection/[id]"
						options={{
							headerShown: false,
						}}
					/>
					<Stack.Screen
						name="category/[slug]"
						options={{
							headerShown: false,
						}}
					/>
					<Stack.Screen
						name="getStarted/index"
						options={{
							headerShown: false,
						}}
					/>
				</Stack>
			</GestureHandlerRootView>
		</QueryClientProvider>
	);
}
