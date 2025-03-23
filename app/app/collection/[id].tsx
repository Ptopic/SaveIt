import { goBack } from '@/utils/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type CollectionRouteProp = RouteProp<{ params: { id: string } }, 'params'>;

const CollectionScreen = () => {
	const route = useRoute<CollectionRouteProp>();
	const { id } = route.params;
	return (
		<SafeAreaView style={styles.container}>
			<Text>Collection {id}</Text>

			<TouchableOpacity onPress={goBack}>
				<Text>Back</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default CollectionScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
