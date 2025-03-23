import { goBack } from '@/utils/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type CollectionRouteProp = RouteProp<{ params: { id: string } }, 'params'>;

const CollectionScreen = () => {
	const route = useRoute<CollectionRouteProp>();
	const { id } = route.params;
	return (
		<View style={styles.container}>
			<Text>Collection {id}</Text>

			<TouchableOpacity onPress={goBack}>
				<Text>Back</Text>
			</TouchableOpacity>
		</View>
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
