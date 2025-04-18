import { IPlace } from '@/api/imports/types';
import Text from '@/components/Text';
import { TouchableOpacity, View } from 'react-native';

interface IProps {
	place: IPlace;
	width: number;
	onPress: () => void;
}

const PlaceCard = ({ place, width, onPress }: IProps) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={{ width }}
			className="justify-start bg-gray50 border border-gray200 rounded-lg p-4 flex flex-col gap-4"
			activeOpacity={1}
		>
			<Text className="heading-xsmall">
				{place.emoji} {place.name}
			</Text>
			<View className="bg-gray300 w-full h-[1px]" />
			<Text className="body-small-regular">{place.description}</Text>
		</TouchableOpacity>
	);
};

export default PlaceCard;
