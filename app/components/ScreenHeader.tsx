import { router } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Title from './Title';

interface IProps {
	allowBack?: boolean;
	title: string;
}

const ScreenHeader = ({ allowBack = true, title }: IProps) => {
	return (
		<View className="flex-row gap-[10] items-center">
			{allowBack ? (
				<View className="w-6">
					<TouchableOpacity onPress={() => router.back()}>
						<Icon name="arrow-back" size={24} color="black" />
					</TouchableOpacity>
				</View>
			) : (
				<View className="w-6" />
			)}
			<View className="flex-1 flex-row justify-center">
				<Title>{title}</Title>
			</View>
			<View className="w-6" />
		</View>
	);
};

export default ScreenHeader;
