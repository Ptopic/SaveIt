import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, ScrollView, View, ViewStyle } from 'react-native';
import {
	PanGestureHandler,
	PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
	runOnJS,
	useAnimatedGestureHandler,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from 'react-native-reanimated';

interface BottomSheetComponentProps {
	isVisible: boolean;
	setIsVisible: (visible: boolean) => void;
	children: React.ReactNode;
	overlayStyle?: ViewStyle;
	sheetStyle?: ViewStyle;
	customAnimatedOverlayStyle?: ViewStyle;
	snapPoints?: string[];
}

const BottomSheetComponent: React.FC<BottomSheetComponentProps> = ({
	isVisible,
	setIsVisible,
	children,
	overlayStyle,
	sheetStyle,
	customAnimatedOverlayStyle,
	snapPoints = ['30%', '80%'],
}) => {
	const [scrollEnabled, setScrollEnabled] = useState(false);

	const { height: screenHeight } = Dimensions.get('window');
	const overlayOpacity = useSharedValue(0);
	const sheetTranslateY = useSharedValue(screenHeight);
	const sheetOffsetY = useSharedValue(screenHeight);

	const snapPointsValue = snapPoints.map(
		(point) => (1 - parseFloat(point) / 100) * screenHeight
	);

	const closeThresholdValue =
		Math.max(...snapPointsValue) + 0.05 * screenHeight;

	const [internalVisible, setInternalVisible] = React.useState(false);

	useEffect(() => {
		if (isVisible) {
			setInternalVisible(true);
			overlayOpacity.value = withTiming(1, { duration: 150 });
			sheetTranslateY.value = withTiming(snapPointsValue[0], { duration: 300 });
			sheetOffsetY.value = snapPointsValue[0];
		} else if (internalVisible) {
			overlayOpacity.value = withTiming(0, { duration: 150 });
			sheetTranslateY.value = withTiming(
				screenHeight,
				{ duration: 150 },
				() => {
					runOnJS(setInternalVisible)(false);
				}
			);
			sheetOffsetY.value = screenHeight;
		}
	}, [isVisible]);

	const animatedOverlayStyle = useAnimatedStyle(() => ({
		opacity: overlayOpacity.value,
	}));

	const animatedSheetStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: sheetTranslateY.value }],
	}));

	const handleGesture = useAnimatedGestureHandler<
		PanGestureHandlerGestureEvent,
		{ startY: number }
	>({
		onStart: (_, ctx) => {
			ctx.startY = sheetTranslateY.value;
		},
		onActive: (event, ctx) => {
			sheetTranslateY.value = Math.max(
				ctx.startY + event.translationY,
				snapPointsValue[snapPoints.length - 1]
			);
		},
		onEnd: (event) => {
			if (sheetTranslateY.value > closeThresholdValue) {
				runOnJS(setIsVisible)(false);
				runOnJS(setScrollEnabled)(false);
			} else {
				const closestSnapPoint = snapPointsValue.reduce((prev, curr) =>
					Math.abs(curr - sheetTranslateY.value) <
					Math.abs(prev - sheetTranslateY.value)
						? curr
						: prev
				);

				if (closestSnapPoint === snapPointsValue[snapPoints.length - 1]) {
					runOnJS(setScrollEnabled)(true);
				} else {
					runOnJS(setScrollEnabled)(false);
				}

				if (Math.abs(event.velocityY) > 1000) {
					sheetTranslateY.value = withTiming(closestSnapPoint, {
						duration: 100,
					});
				} else {
					sheetTranslateY.value = withSpring(closestSnapPoint, {
						damping: 20,
						stiffness: 150,
					});
				}

				sheetOffsetY.value = closestSnapPoint;
			}
		},
	});

	const handleClose = () => {
		setIsVisible(false);
	};

	if (!internalVisible) return null;

	return (
		<Modal
			transparent={true}
			visible={internalVisible}
			animationType="none"
			onRequestClose={handleClose}
		>
			<Animated.View
				className="absolute inset-0 bg-black/50"
				style={[animatedOverlayStyle, customAnimatedOverlayStyle]}
				onTouchEnd={handleClose}
			/>

			<View style={[overlayStyle]} className="flex-1 justify-end items-center">
				<PanGestureHandler onGestureEvent={handleGesture}>
					<Animated.View
						className="bg-white rounded-t-lg h-full w-full p-4"
						style={[sheetStyle, animatedSheetStyle]}
					>
						<View className="flex-1 flex-col gap-4">
							<View className="flex-row items-center justify-center">
								<View className="w-[50px] h-[4px] bg-gray400 rounded-full" />
							</View>
							<ScrollView
								className="flex-1"
								showsVerticalScrollIndicator={false}
								scrollEnabled={scrollEnabled}
								bounces={false}
							>
								{children}
							</ScrollView>
						</View>
					</Animated.View>
				</PanGestureHandler>
			</View>
		</Modal>
	);
};

export default BottomSheetComponent;
