import { useState } from 'react';
import {
	Dimensions,
	GestureResponderEvent,
	LayoutChangeEvent,
	Modal,
	Pressable,
	Text as RNText,
	StyleSheet,
	View,
} from 'react-native';
import Text from '../Text';

interface PopupState {
	visible: boolean;
	content: React.ReactNode;
	pressX: number;
	pressY: number;
}

export const renderStepIngredients = (
	text: string,
	ingredients: {
		emoji: string;
		quantity: string;
		ingredient: string;
	}[]
) => {
	if (!text) return null;

	const [popup, setPopup] = useState<PopupState>({
		visible: false,
		content: null,
		pressX: 0,
		pressY: 0,
	});
	const [measuredWidth, setMeasuredWidth] = useState(0);

	const handleUnderlinePress = (
		event: GestureResponderEvent,
		ingredient: {
			emoji: string;
			quantity: string;
			ingredient: string;
		} | null
	) => {
		const pressX = event.nativeEvent.pageX;
		const pressY = event.nativeEvent.pageY;

		setMeasuredWidth(0);

		setPopup({
			visible: true,
			content: (
				<View className="flex-row gap-2 items-center">
					<Text>{ingredient?.emoji}</Text>
					<View className="flex-row gap-2 flex-wrap">
						<Text className="font-bold">{ingredient?.quantity}</Text>
						<Text>{ingredient?.ingredient}</Text>
					</View>
				</View>
			),
			pressX: pressX,
			pressY: pressY,
		});
	};

	const closePopup = () => {
		setPopup({ ...popup, visible: false });
	};

	const screenWidth = Dimensions.get('window').width;
	const yOffset = -30;
	const padding = 10;
	let finalLeft = popup.pressX;
	let finalTop = popup.pressY + yOffset;

	if (measuredWidth > 0) {
		finalLeft = popup.pressX - measuredWidth / 2;

		if (finalLeft < padding) {
			finalLeft = padding;
		} else if (finalLeft + measuredWidth > screenWidth - padding) {
			finalLeft = screenWidth - measuredWidth - padding;
		}
	}

	if (finalTop < padding) {
		finalTop = padding;
	}

	const parts = text.split('*');

	return (
		<View className="flex-1">
			<Text>
				{parts.map((part, index) => {
					const ingredient = ingredients.find((ingredient) =>
						new RegExp(`\\b${part}\\b`).test(ingredient.ingredient)
					);
					if (index % 2 === 1 && ingredient) {
						return (
							<RNText
								key={index}
								style={styles.underlinedText}
								onPress={(e: GestureResponderEvent) =>
									handleUnderlinePress(e, ingredient || null)
								}
							>
								<Text>{part}</Text>
							</RNText>
						);
					}
					return <Text key={index}>{part}</Text>;
				})}
			</Text>

			<Modal
				transparent={true}
				visible={popup.visible}
				onRequestClose={closePopup}
				animationType="fade"
			>
				<Pressable className="flex-1" onPress={closePopup}>
					<View
						onLayout={(event: LayoutChangeEvent) => {
							const newWidth = event.nativeEvent.layout.width;
							if (newWidth > 0 && newWidth !== measuredWidth) {
								setMeasuredWidth(newWidth);
							}
						}}
						style={[
							styles.popupContainer,
							{
								left: finalLeft,
								top: finalTop,
							},
						]}
						onStartShouldSetResponder={() => true}
					>
						<Text>{popup.content}</Text>
					</View>
				</Pressable>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	underlinedText: {
		textDecorationLine: 'underline',
	},
	popupContainer: {
		position: 'absolute',
		backgroundColor: 'white',
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 6,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
});
