import { getTailwindHexColor } from '@/utils/getTailwindColor';
import { useEffect, useState } from 'react';
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

interface ModalPosition {
	left: number;
	top: number;
}

export const renderStepIngredients = (
	text: string,
	ingredients: {
		emoji?: string;
		quantity: string;
		ingredient: string;
		displayQuantity?: string;
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
	const [modalPosition, setModalPosition] = useState<ModalPosition>({
		left: 0,
		top: 0,
	});

	const handleUnderlinePress = (
		event: GestureResponderEvent,
		ingredient: {
			emoji?: string;
			quantity: string;
			ingredient: string;
			displayQuantity?: string;
		} | null
	) => {
		const pressX = event.nativeEvent.pageX;
		const pressY = event.nativeEvent.pageY;

		setMeasuredWidth(0);

		setPopup({
			visible: true,
			content: (
				<View className="flex-row items-start gap-2 pr-2">
					{ingredient?.emoji && <Text>{ingredient.emoji}</Text>}
					<Text>
						<Text className="font-bold">
							{ingredient?.displayQuantity || ingredient?.quantity}
						</Text>{' '}
						{ingredient?.ingredient}
					</Text>
				</View>
			),
			pressX,
			pressY,
		});
	};

	const closePopup = () => {
		setPopup({ ...popup, visible: false });
	};

	const handleLayout = (event: LayoutChangeEvent) => {
		const { width } = event.nativeEvent.layout;
		if (width > 0 && width !== measuredWidth) {
			setMeasuredWidth(width);
		}
	};

	useEffect(() => {
		if (popup.visible && measuredWidth > 0) {
			const screenWidth = Dimensions.get('window').width;
			const yOffset = -40;
			const padding = 10;

			let targetX = popup.pressX - measuredWidth / 2;
			let targetY = popup.pressY + yOffset;

			let finalLeft = targetX;
			let finalTop = targetY;

			if (finalLeft < padding) {
				finalLeft = padding;
			} else if (finalLeft + measuredWidth > screenWidth - padding) {
				finalLeft = screenWidth - measuredWidth - padding;
			}

			if (finalTop < padding) {
				finalTop = padding;
			}

			finalLeft = Math.max(padding, finalLeft);
			finalTop = Math.max(padding, finalTop);

			setModalPosition({ left: finalLeft, top: finalTop });
		} else if (!popup.visible) {
			setModalPosition({ left: 0, top: 0 });
		}
	}, [popup.visible, popup.pressX, popup.pressY, measuredWidth]);

	const parts = text.split('*');

	return (
		<View className="flex-1">
			<Text>
				{parts.map((part, index) => {
					const ingredientMatch = ingredients.find((ing) =>
						new RegExp(`\\b${part}\\b`, 'i').test(ing.ingredient)
					);
					if (index % 2 === 1 && ingredientMatch) {
						return (
							<RNText
								key={index}
								style={styles.underlinedText}
								onPress={(e: GestureResponderEvent) =>
									handleUnderlinePress(e, ingredientMatch)
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
				<Pressable style={styles.modalOverlay} onPress={closePopup}>
					{measuredWidth > 0 && (
						<View
							style={[
								styles.popupContainer,
								{
									left: modalPosition.left,
									top: modalPosition.top,
								},
							]}
							onStartShouldSetResponder={() => true}
						>
							{popup.content}
						</View>
					)}
					{!measuredWidth ? (
						<View style={styles.measurementHelper} onLayout={handleLayout}>
							{popup.content}
						</View>
					) : null}
				</Pressable>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	underlinedText: {
		color: getTailwindHexColor('orange400'),
	},
	modalOverlay: {
		flex: 1,
	},
	popupContainer: {
		position: 'absolute',
		backgroundColor: 'white',
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		maxWidth: '80%',
		zIndex: 10,
	},
	measurementHelper: {
		position: 'absolute',
		top: -9999,
		left: -9999,
		opacity: 0,
		backgroundColor: 'white',
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 8,
		maxWidth: '80%',
	},
});
