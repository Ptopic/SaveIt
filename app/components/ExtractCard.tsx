import { getTailwindHexColor } from '@/utils/getTailwindColor';
import { Link } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { twMerge } from 'tailwind-merge';

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
	const textColorHex = getTailwindHexColor(textColor);

	return (
		<Link href={url as any}>
			<View
				className={twMerge(
					'flex-row gap-[5] items-center text-center p-[10] rounded-lg',
					bgColor && `bg-${bgColor}`
				)}
			>
				{icon}
				{iconName && (
					<Icon name={iconName} size={20} color={`${textColorHex}`} />
				)}
				<Text
					className={twMerge(
						'text-xl font-bold',
						textColor && `text-${textColor}`
					)}
				>
					{title}
				</Text>
			</View>
		</Link>
	);
};

export default ExtractCard;
