import { blurhash } from '@/shared/contants';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
interface IProps {
	id: number;
	name: string;
	image: string;
}

const CollectionCard = ({ id, name, image }: IProps) => {
	return (
		<>
			{image ? (
				<Link
					href={`/collection/${id}`}
					className="w-[100] h-[130] rounded-lg bg-gray200"
				>
					<Image
						source={{ uri: image }}
						style={styles.image}
						contentFit="cover"
						placeholder={blurhash}
						transition={500}
					/>
				</Link>
			) : (
				<Link
					href={`/collection/${id}`}
					className="w-[100] h-[130] rounded-lg bg-white p-[10]"
				>
					<Text>{name}</Text>
				</Link>
			)}
		</>
	);
};

export default CollectionCard;

const styles = StyleSheet.create({
	image: {
		width: '100%',
		height: '100%',
		borderRadius: 10,
	},
});
