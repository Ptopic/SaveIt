import React, { useEffect } from 'react';
import {
	Modal,
	StyleSheet,
	TouchableWithoutFeedback,
	ViewStyle,
} from 'react-native';
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';

interface ModalComponentProps {
	modalVisible: boolean;
	setModalVisible: (visible: boolean) => void;
	children: React.ReactNode;
	overlayStyle?: ViewStyle;
	modalStyle?: ViewStyle;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
	modalVisible,
	setModalVisible,
	children,
	overlayStyle,
	modalStyle,
}) => {
	// Animation values
	const overlayOpacity = useSharedValue(0);
	const modalTranslateY = useSharedValue(300);
	// This state tracks the "real" visibility (including during animations)
	const [internalVisible, setInternalVisible] = React.useState(false);

	// Handle modal opening and closing animations
	useEffect(() => {
		if (modalVisible) {
			// When opening, show modal immediately and animate in
			setInternalVisible(true);
			overlayOpacity.value = withTiming(1, { duration: 300 });
			modalTranslateY.value = withTiming(0, { duration: 300 });
		} else if (internalVisible) {
			// When closing, animate out then hide modal
			overlayOpacity.value = withTiming(0, { duration: 300 });
			modalTranslateY.value = withTiming(300, { duration: 300 }, () => {
				runOnJS(setInternalVisible)(false);
			});
		}
	}, [modalVisible]);

	// Animated styles
	const animatedOverlayStyle = useAnimatedStyle(() => ({
		opacity: overlayOpacity.value,
	}));

	const animatedModalStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: modalTranslateY.value }],
	}));

	// Close modal with animation
	const handleClose = () => {
		setModalVisible(false);
	};

	return (
		<Modal
			transparent={true}
			visible={internalVisible}
			animationType="none"
			onRequestClose={handleClose}
		>
			<TouchableWithoutFeedback onPress={handleClose}>
				<Animated.View
					style={[styles.overlay, overlayStyle, animatedOverlayStyle]}
				>
					<TouchableWithoutFeedback>
						<Animated.View
							style={[styles.modalContainer, modalStyle, animatedModalStyle]}
						>
							{children}
						</Animated.View>
					</TouchableWithoutFeedback>
				</Animated.View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalContainer: {
		backgroundColor: 'white',
		borderRadius: 10,
		padding: 20,
		width: '80%',
		maxHeight: '80%',
	},
});

export default ModalComponent;
