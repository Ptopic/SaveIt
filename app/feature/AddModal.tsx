import { BlurView } from 'expo-blur';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const AddModal = ({
	translateY,
	opacity,
}: {
	translateY: any;
	opacity: any;
}) => {
	return (
		<BlurView
			intensity={50}
			className="absolute z-20 -top-[85px] left-0 right-0 bottom-0 w-full h-full"
			style={[
				{
					transform: [{ translateY: translateY.value }],
					opacity: opacity.value,
				},
			]}
		>
			<TouchableOpacity className="absolute z-20 pb-2 left-0 right-0 bottom-0 w-full h-full flex justify-end items-center">
				<Text>Paste link from clipboard</Text>
			</TouchableOpacity>
		</BlurView>
	);
};

export default AddModal;
