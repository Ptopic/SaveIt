import React from 'react';
import { TouchableOpacity } from 'react-native';
import { twMerge } from 'tailwind-merge';
import Text from './Text';

const Button = ({
	onPress,
	disabled,
	isSubmitting,
}: {
	onPress: () => void;
	disabled: boolean;
	isSubmitting: boolean;
}) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			disabled={disabled}
			className={twMerge(
				'bg-black rounded-lg p-[10] justify-center items-center',
				disabled && 'opacity-50'
			)}
		>
			<Text className="text-white text-lg font-bold">
				{isSubmitting ? 'Creating...' : 'Create'}
			</Text>
		</TouchableOpacity>
	);
};

export default Button;
