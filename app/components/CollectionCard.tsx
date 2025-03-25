import { Link } from 'expo-router';
import React from 'react';
import { Image, Text } from 'react-native';

interface IProps {
	id: number;
	name: string;
	image: string;
}

const CollectionCard = ({ id, name, image }: IProps) => {
	console.log(image);
	return (
		<>
			{image ? (
				<Link
					href={`/collection/${id}`}
					className="w-[100] h-[130] rounded-lg bg-white"
				>
					<Image source={{ uri: image }} className="w-full h-full rounded-lg" />
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
