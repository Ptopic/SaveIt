import { IMPORTS, LOCATIONS } from '@/api/constants';
import useCreateImport from '@/api/imports/hooks/useCreateImport';
import AddNewImportModal from '@/feature/AddNewImportModal';
import {
	BookmarkIcon,
	MapPinFullIcon,
	MapPinIcon,
	PlusIcon,
	SearchIcon,
	UserIcon,
} from '@/shared/svgs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import { Tabs, usePathname } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Pressable } from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import ShareMenu from 'react-native-share-menu';
import { useToast } from 'react-native-toast-notifications';

type SharedItem = {
	mimeType: string;
	data: string | string[];
	extraData?: {
		url?: string;
		[key: string]: any;
	};
};

export default function TabLayout() {
	const toast = useToast();
	const pathname = usePathname();
	const queryClient = useQueryClient();
	const [sharedUrlData, setSharedUrlData] = useState<string | null>(null);
	const [isAppRefocused, setIsAppRefocused] = useState(false);
	const { mutate: createImport } = useCreateImport();

	const handleShare = useCallback(
		async (item: SharedItem | null | undefined) => {
			if (!item) {
				return;
			}

			const sharedUrl = item.extraData?.url || '';

			const previousSharedUrl = await AsyncStorage.getItem('previousSharedUrl');

			if (previousSharedUrl === sharedUrl && previousSharedUrl !== null) {
				return;
			}

			if (sharedUrl === '' || sharedUrl === null) {
				return;
			}

			if (
				sharedUrl &&
				(!sharedUrl.includes('https://') ||
					(!sharedUrl.includes('tiktok') && !sharedUrl.includes('instagram')))
			) {
				toast.show('Please paste a valid link', { type: 'error' });
				return;
			}

			setSharedUrlData(sharedUrl);

			await AsyncStorage.setItem('previousSharedUrl', sharedUrl);
		},
		[]
	);

	const appState = useRef(AppState.currentState);

	useEffect(() => {
		const handleAppStateChange = async (nextAppState: AppStateStatus) => {
			if (
				appState.current.match(/inactive|background/) &&
				nextAppState === 'active'
			) {
				await ShareMenu.getInitialShare(handleShare);
				setIsAppRefocused(true);
			}

			appState.current = nextAppState;
		};

		const subscription = AppState.addEventListener(
			'change',
			handleAppStateChange
		);

		return () => {
			subscription.remove();
		};
	}, []);

	useEffect(() => {
		if (isAppRefocused) {
			queryClient.invalidateQueries({
				queryKey: [IMPORTS, '6', '', ''],
			});
			queryClient.invalidateQueries({
				queryKey: [LOCATIONS],
			});
			setIsAppRefocused(false); // Reset the flag after handling
		}
	}, [isAppRefocused, queryClient]);

	useEffect(() => {
		if (sharedUrlData !== null) {
			createImport(
				{ url: sharedUrlData },
				{
					onSuccess: () => {
						queryClient.invalidateQueries({
							queryKey: [IMPORTS],
							exact: false,
						});
						queryClient.invalidateQueries({
							queryKey: [LOCATIONS],
							exact: false,
						});
					},
				}
			);
		}
		setSharedUrlData(null);
	}, [sharedUrlData]);

	const onAppRefocused = () => {
		queryClient.invalidateQueries({
			queryKey: [IMPORTS, '6', '', ''],
		});
		queryClient.invalidateQueries({
			queryKey: [LOCATIONS],
		});
	};

	const [modalVisible, setModalVisible] = useState(false);

	const addButtonRotation = useSharedValue(0);
	const addButtonScale = useSharedValue(1);

	useEffect(() => {
		if (modalVisible) {
			addButtonRotation.value = withTiming(45, { duration: 200 });
			addButtonScale.value = withTiming(1.2, { duration: 200 });
		} else {
			addButtonRotation.value = withTiming(0, { duration: 200 });
			addButtonScale.value = withTiming(1, { duration: 200 });
		}
	}, [modalVisible]);

	const animatedButtonStyle = useAnimatedStyle(() => ({
		transform: [
			{ rotate: `${addButtonRotation.value}deg` },
			{ scale: addButtonScale.value },
		],
	}));

	useEffect(() => {
		setModalVisible(false);
	}, [pathname]);

	return (
		<>
			<Tabs
				screenOptions={{
					tabBarActiveTintColor: 'black',
					// Disable the static render of the header on web
					// to prevent a hydration error in React Navigation v6.
					headerShown: false,
					tabBarShowLabel: false,
					tabBarStyle: {
						backgroundColor: 'white',
						// borderTopColor: 'white',
						paddingTop: 15,
					},
				}}
			>
				<Tabs.Screen
					name="index"
					options={{
						tabBarIcon: ({ color, focused }) => (
							<BookmarkIcon
								color={color}
								width={26}
								height={26}
								fill={focused ? 'black' : 'none'}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="map"
					options={{
						tabBarIcon: ({ color, focused }) =>
							focused ? (
								<MapPinFullIcon color={color} width={28} height={28} />
							) : (
								<MapPinIcon color={color} width={28} height={28} />
							),
					}}
				/>
				<Tabs.Screen
					name="add"
					options={{
						tabBarIcon: () => (
							<Animated.View
								style={[animatedButtonStyle]}
								className="bg-black rounded-full w-[48] h-[48] justify-center items-center shadow-[0_0_10px_rgba(0,0,0,0.5)]"
							>
								<PlusIcon color="white" width={24} height={24} />
							</Animated.View>
						),
						tabBarButton: (props) => (
							<Pressable
								{...props}
								onPress={() => {
									setModalVisible(!modalVisible);
								}}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="search"
					options={{
						tabBarIcon: ({ color }) => (
							<SearchIcon color={color} width={26} height={26} />
						),
					}}
				/>
				<Tabs.Screen
					name="user"
					options={{
						tabBarIcon: ({ color, focused }) => (
							<UserIcon
								color={color}
								width={26}
								height={26}
								fill={focused ? 'black' : 'none'}
							/>
						),
					}}
				/>
			</Tabs>

			<AddNewImportModal
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
			/>
		</>
	);
}
