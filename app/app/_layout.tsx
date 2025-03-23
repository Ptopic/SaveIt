import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
		...FontAwesome.font,
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
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
	const [accessToken, setAccessToken] = React.useState<string | null>(null);

	useEffect(() => {
		const getToken = async () => {
			const token = await AsyncStorage.getItem('accessToken');
			setAccessToken(token);
		};

		getToken();
	}, []);

	useEffect(() => {
		if (!accessToken) {
			router.push('/login' as any);
		}
	}, [accessToken]);

	return (
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
					name="login/index"
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="register/index"
					options={{
						headerShown: false,
					}}
				/>
			</Stack>
		</GestureHandlerRootView>
	);
}
