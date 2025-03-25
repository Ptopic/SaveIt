import { Link } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const LinkComponent = ({
	href,
	children,
	onPress,
}: {
	href?: string;
	onPress?: () => void;
	children: React.ReactNode;
}) => {
	return (
		<>
			{onPress ? (
				<TouchableOpacity onPress={onPress}>
					<Text className="text-black underline">{children}</Text>
				</TouchableOpacity>
			) : (
				<Link href={href as any}>
					<Text className="text-black underline">{children}</Text>
				</Link>
			)}
		</>
	);
};

export default LinkComponent;
