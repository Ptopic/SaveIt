import { Tabs } from 'expo-router';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
	name: React.ComponentProps<typeof Icon>['name'];
	color: string;
}) {
	return <Icon size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: 'black',
				// Disable the static render of the header on web
				// to prevent a hydration error in React Navigation v6.
				headerShown: false,
				tabBarShowLabel: false,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? 'bookmark' : 'bookmark-outline'}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="map"
				options={{
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? 'map-marker' : 'map-marker-outline'}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="user"
				options={{
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? 'account' : 'account-outline'}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
