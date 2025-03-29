import Text from '@/components/Text';
import { goBack } from '@/utils/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, TouchableOpacity } from 'react-native';

type CategoryRouteProp = RouteProp<{ params: { slug: string } }, 'params'>;

const CategoryScreen = () => {
	const route = useRoute<CategoryRouteProp>();
	const { slug } = route.params;
	return (
		<SafeAreaView className="flex-1 items-center justify-center">
			<Text>Category {slug}</Text>
			<TouchableOpacity onPress={goBack}>
				<Text>Back</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default CategoryScreen;
