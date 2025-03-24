import React, { useState } from 'react';
import {
	NativeSyntheticEvent,
	StyleSheet,
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
}: {
	name: string;
	placeholder: string;
	value: string;
	onChangeText: (text: string) => void;
	onBlur: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
	error?: string;
	type?: 'text' | 'password';
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
			style={[
				styles.inputContainer,
				{ marginTop: isFocused || value ? 20 : 0 },
			]}
		>
			<Animated.Text style={[styles.placeholder, animatedPlaceholderStyle]}>
				{placeholder}
			</Animated.Text>
			<TextInput
				testID={name}
				autoComplete="off"
				secureTextEntry={type === 'password'}
				value={value}
				onChangeText={handleChangeText}
				onBlur={handleBlur}
				placeholder={placeholder}
				placeholderTextColor="gray"
				autoCapitalize="none"
				style={styles.input}
			/>
			{error && <ErrorText error={error} />}
		</View>
	);
};

export default Input;

const styles = StyleSheet.create({
	inputContainer: {
		gap: 5,
		position: 'relative',
		width: '100%',
	},
	input: {
		borderWidth: 1,
		borderColor: 'black',
		borderRadius: 5,
		padding: 10,
	},
	placeholder: {
		position: 'absolute',
		left: 2,
		top: 10,
		color: 'black',
	},
});
