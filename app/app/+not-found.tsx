import Text from '@/components/Text';
import Title from '@/components/Title';
import { Link, Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function NotFoundScreen() {
	return (
		<>
			<Stack.Screen options={{ title: 'Oops!' }} />
			<View className="flex-1 items-center justify-center p-[20]">
				<Title>This screen doesn't exist.</Title>

				<Link href="/" className="mt-[15] p-[15]">
					<Text className="text-white text-lg font-bold">
						Go to home screen!
					</Text>
				</Link>
			</View>
		</>
	);
}
