import React, { useState } from 'react';
import {
	NativeSyntheticEvent,
	Text,
	TextInput,
	TextInputFocusEventData,
	View,
} from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import ErrorText from './ErrorText';

const Input = ({
	name,
	placeholder,
	value,
	onChangeText,
	onBlur,
	error,
	type = 'text',
	maxLength,
}: {
	name: string;
	placeholder: string;
	value: string;
	onChangeText: (text: string) => void;
	onBlur: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
	error?: string;
	type?: 'text' | 'password';
	maxLength?: number;
}) => {
	const [isFocused, setIsFocused] = useState(false);
	const placeholderPosition = useSharedValue(value ? -32 : 0);
	const placeholderOpacity = useSharedValue(value ? 1 : 0);

	const animatedPlaceholderStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: placeholderPosition.value }, { translateX: 2 }],
			opacity: placeholderOpacity.value,
		};
	});

	const handleChangeText = (text: string) => {
		if (text.length > 0) {
			setIsFocused(true);
			placeholderPosition.value = withTiming(-32, { duration: 150 });
			placeholderOpacity.value = withTiming(1, { duration: 150 });
		} else {
			setIsFocused(false);
			placeholderPosition.value = withTiming(0, { duration: 150 });
			placeholderOpacity.value = withTiming(0, { duration: 150 });
		}
		onChangeText(text);
	};

	const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
		setIsFocused(false);
		if (!value) {
			placeholderPosition.value = withTiming(0, { duration: 150 });
			placeholderOpacity.value = withTiming(0, { duration: 150 });
		}
		onBlur(e);
	};

	return (
		<View
			className="gap-[5] relative w-full"
			style={{ marginTop: isFocused || value ? 20 : 0 }}
		>
			<Animated.Text
				className="absolute left-[2] top-[10] text-black"
				style={animatedPlaceholderStyle}
			>
				{placeholder}
			</Animated.Text>
			<View className="border border-black rounded-lg p-[10]">
				<TextInput
					testID={name}
					autoComplete="off"
					secureTextEntry={type === 'password'}
					value={value}
					onChangeText={handleChangeText}
					onBlur={handleBlur}
					placeholder={placeholder}
					placeholderTextColor="gray"
					style={maxLength ? { width: '85%' } : {}}
				/>
				{maxLength && (
					<Text className="absolute right-[10] bottom-[10] text-gray-500">
						{value.length}/{maxLength}
					</Text>
				)}
			</View>
			{error && <ErrorText error={error} />}
		</View>
	);
};

export default Input;
