import { goBack } from '@/utils/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';

type CategoryRouteProp = RouteProp<{ params: { slug: string } }, 'params'>;

const CategoryScreen = () => {
	const route = useRoute<CategoryRouteProp>();
	const { slug } = route.params;
	return (
		<SafeAreaView style={styles.container}>
			<Text>Category {slug}</Text>
			<TouchableOpacity onPress={goBack}>
				<Text>Back</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default CategoryScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
