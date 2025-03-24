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
	const overlayOpacity = useSharedValue(0);
	const modalTranslateY = useSharedValue(300);

	const [internalVisible, setInternalVisible] = React.useState(false);

	useEffect(() => {
		if (modalVisible) {
			setInternalVisible(true);
			overlayOpacity.value = withTiming(1, { duration: 150 });
			modalTranslateY.value = withTiming(0, { duration: 150 });
		} else if (internalVisible) {
			overlayOpacity.value = withTiming(0, { duration: 150 });
			modalTranslateY.value = withTiming(150, { duration: 150 }, () => {
				runOnJS(setInternalVisible)(false);
			});
		}
	}, [modalVisible]);

	const animatedOverlayStyle = useAnimatedStyle(() => ({
		opacity: overlayOpacity.value,
	}));

	const animatedModalStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: modalTranslateY.value }],
	}));

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
