import { ILocation } from '@/api/imports/types';
import LocationDisplay from '@/components/LocationDisplay';
import Text from '@/components/Text';
import { CloseIcon } from '@/shared/svgs';
import { getTailwindHexColor } from '@/utils/getTailwindColor';
import { ScrollView, TouchableOpacity, View } from 'react-native';

interface IProps {
	selectedLocation: ILocation;
	onLocationDetailsClose: () => void;
}

const LocationDisplayModal = ({
	selectedLocation,
	onLocationDetailsClose,
}: IProps) => {
	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<View className="flex-row justify-between items-center">
				<View className="w-12 h-12 rounded-full bg-gray50 border border-gray200 items-center justify-center">
					<Text className="text-lg">{selectedLocation?.emoji}</Text>
				</View>
				<TouchableOpacity
					className="bg-red100 rounded-full w-[30] h-[30] justify-center items-center"
					onPress={() => {
						onLocationDetailsClose();
					}}
				>
					<CloseIcon
						width={20}
						height={20}
						color={getTailwindHexColor('red400')}
					/>
				</TouchableOpacity>
			</View>
			<LocationDisplay data={selectedLocation} />
			<View className="h-[20px]" />
		</ScrollView>
	);
};

export default LocationDisplayModal;
