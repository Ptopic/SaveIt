import AddNewImportModal from '@/feature/AddNewImportModal';
import {
	BookmarkIcon,
	MapPinFullIcon,
	MapPinIcon,
	PlusIcon,
	SearchIcon,
	UserIcon,
} from '@/shared/svgs';
import { Tabs, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';

export default function TabLayout() {
	const pathname = usePathname();

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
