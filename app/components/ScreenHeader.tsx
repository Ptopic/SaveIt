import { router } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Title from './Title';
import { ArrowLeftIcon } from '@/shared/svgs';

interface IProps {
	allowBack?: boolean;
	title: string;
}

const ScreenHeader = ({ allowBack = true, title }: IProps) => {
	return (
		<View className="flex-row gap-[10] items-center">
			{allowBack && (
				<View className="bg-white p-2 rounded-md border-gray300 border-[1px]">
					<TouchableOpacity onPress={() => router.back()}>
						<ArrowLeftIcon width={22} height={22} color="black" />
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
