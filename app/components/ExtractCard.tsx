import { Link } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
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
			<View
				className="flex-row gap-[5] items-center text-center p-[10] rounded-lg"
				style={{ backgroundColor: bgColor }}
			>
				{icon}
				{iconName && <Icon name={iconName} size={20} color={textColor} />}
				<Text className="text-xl font-bold" style={{ color: textColor }}>
					{title}
				</Text>
			</View>
		</Link>
	);
};

export default ExtractCard;
