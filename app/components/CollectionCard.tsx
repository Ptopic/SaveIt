import { Link } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

interface IProps {
	id: number;
}

const CollectionCard = ({ id }: IProps) => {
	return (
		<Link href={`/collection/${id}`} style={styles.container}>
			<Text>Test</Text>
		</Link>
	);
};

export default CollectionCard;

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		padding: 10,
		width: 100,
		height: 130,
		borderRadius: 10,
		shadowColor: '#000',
		elevation: 5,
	},
});
