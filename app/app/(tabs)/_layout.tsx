import {
	BookmarkIcon,
	LinkIcon,
	MapPinFullIcon,
	MapPinIcon,
	PlusIcon,
	SearchIcon,
	UserIcon,
} from '@/shared/svgs';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, TouchableOpacity } from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';

export default function TabLayout() {
	const [modalVisible, setModalVisible] = useState(false);

	const modalOpacity = useSharedValue(0);
	const modalTranslateY = useSharedValue(150);
	const textOpacity = useSharedValue(0);

	const addButtonRotation = useSharedValue(0);
	const addButtonScale = useSharedValue(1);
	useEffect(() => {
		if (modalVisible) {
			textOpacity.value = withTiming(1, { duration: 200 });
			modalOpacity.value = withTiming(1, { duration: 200 });
			modalTranslateY.value = withTiming(0, { duration: 200 });
			addButtonRotation.value = withTiming(45, { duration: 200 });
			addButtonScale.value = withTiming(1.2, { duration: 200 });
		} else {
			textOpacity.value = withTiming(0, { duration: 200 });
			modalOpacity.value = withTiming(0, { duration: 200 });
			modalTranslateY.value = withTiming(150, { duration: 200 });
			addButtonRotation.value = withTiming(0, { duration: 200 });
			addButtonScale.value = withTiming(1, { duration: 200 });
		}
	}, [modalVisible]);

	const animatedModalOpacity = useAnimatedStyle(() => ({
		opacity: modalOpacity.value,
	}));

	const animatedModalTranslateY = useAnimatedStyle(() => ({
		transform: [{ translateY: modalTranslateY.value }],
	}));

	const animatedTextOpacity = useAnimatedStyle(() => ({
		opacity: textOpacity.value,
	}));

	const animatedButtonStyle = useAnimatedStyle(() => ({
		transform: [
			{ rotate: `${addButtonRotation.value}deg` },
			{ scale: addButtonScale.value },
		],
	}));

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
								<MapPinFullIcon color={color} width={26} height={26} />
							) : (
								<MapPinIcon color={color} width={26} height={26} />
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
			<Animated.View
				className="absolute z-20 -top-[85px] left-0 right-0 bottom-0 w-full h-full"
				style={[animatedModalOpacity, animatedModalTranslateY]}
			>
				<BlurView intensity={50} className="w-full h-full">
					<TouchableOpacity
						className="absolute z-20 pb-2 left-0 right-0 bottom-0 w-full h-full flex justify-end items-center"
						onPress={() => setModalVisible(false)}
					>
						<Animated.View
							style={[animatedTextOpacity]}
							className="bg-white border border-gray-200 rounded-lg p-4 flex flex-row items-center gap-2"
						>
							<LinkIcon color="red" width={24} height={24} />
							<Text className="body-medium-regular">
								Paste link from clipboard
							</Text>
						</Animated.View>
					</TouchableOpacity>
				</BlurView>
			</Animated.View>
		</>
	);
}
