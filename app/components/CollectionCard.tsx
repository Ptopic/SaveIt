import { Link } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text } from 'react-native';

interface IProps {
	id: number;
	name: string;
	image: string;
}

const CollectionCard = ({ id, name, image }: IProps) => {
	return (
		<>
			{image ? (
				<Link href={`/collection/${id}`} style={styles.imageContainer}>
					<Image source={{ uri: image }} style={styles.image} />
				</Link>
			) : (
				<Link href={`/collection/${id}`} style={styles.container}>
					<Text>{name}</Text>
				</Link>
			)}
		</>
	);
};

export default CollectionCard;

const styles = StyleSheet.create({
	imageContainer: {
		backgroundColor: 'white',
		width: 100,
		height: 130,
		borderRadius: 10,
		shadowColor: '#000',
		elevation: 5,
	},
	image: {
		width: '100%',
		height: '100%',
		borderRadius: 10,
	},
	container: {
		backgroundColor: 'white',
		padding: 10,
		width: 100,
		height: 130,
		shadowColor: '#000',
		elevation: 5,
	},
});
