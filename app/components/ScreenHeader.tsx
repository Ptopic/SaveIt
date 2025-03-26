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
			{allowBack && (
				<View className="bg-white p-2 rounded-md border-gray100 border-[1px]">
					<TouchableOpacity onPress={() => router.back()}>
						<Icon name="arrow-back" size={22} color="black" />
					</TouchableOpacity>
				</View>
			)}
			<View className="flex-1 flex-row justify-start">
				<Title>{title}</Title>
			</View>
		</View>
	);
};

export default ScreenHeader;
