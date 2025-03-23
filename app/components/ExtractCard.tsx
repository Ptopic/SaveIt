import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface IProps {
	title: string;
	icon?: React.ReactNode;
	iconName?: string;
	bgColor: string;
	textColor: string;
	url: string;
}

const ExtractCard = ({
	title,
	icon,
	iconName,
	bgColor,
	textColor,
	url,
}: IProps) => {
	return (
		<Link href={url as any}>
			<View style={[styles.container, { backgroundColor: bgColor }]}>
				{icon}
				{iconName && <Icon name={iconName} size={20} color={textColor} />}
				<Text style={[styles.title, { color: textColor }]}>{title}</Text>
			</View>
		</Link>
	);
};

export default ExtractCard;

const styles = StyleSheet.create({
	container: {
		width: 'auto',
		flexDirection: 'row',
		gap: 5,
		alignItems: 'center',
		textAlign: 'center',
		padding: 10,
		borderRadius: 10,
	},
	title: {
		fontSize: 19,
		fontWeight: 'bold',
	},
});
