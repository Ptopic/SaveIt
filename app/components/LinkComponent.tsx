import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

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
					<Text style={styles.link}>{children}</Text>
				</TouchableOpacity>
			) : (
				<Link href={href as any}>
					<Text style={styles.link}>{children}</Text>
				</Link>
			)}
		</>
	);
};

export default LinkComponent;

const styles = StyleSheet.create({
	link: {
		color: 'black',
		textDecorationLine: 'underline',
	},
});
