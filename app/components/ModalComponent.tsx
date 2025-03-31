import React, { useEffect } from 'react';
import { Modal, View, ViewStyle } from 'react-native';
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
			<Animated.View
				className="absolute inset-0 bg-black/50"
				style={[animatedOverlayStyle]}
				onTouchEnd={handleClose}
			/>

			<View
				className="flex-1 justify-center items-center"
				style={[overlayStyle]}
			>
				<Animated.View
					className="bg-white rounded-lg p-[20] w-[80%] max-h-[80%]"
					style={[modalStyle, animatedModalStyle]}
				>
					{children}
				</Animated.View>
			</View>
		</Modal>
	);
};

export default ModalComponent;
