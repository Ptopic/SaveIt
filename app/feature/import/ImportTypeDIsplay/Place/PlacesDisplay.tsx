import { IPlace } from '@/api/imports/types';
import { getDeviceWidth } from '@/utils/device';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import PlaceCard from './PlaceCard';

interface IProps {
	places: IPlace[];
	handleItemPress: (item: any) => void;
}

const cardWidth = getDeviceWidth() - 40;

const PlacesDisplay = ({ places, handleItemPress }: IProps) => {
	return (
		<ScrollView
			horizontal
			showsVerticalScrollIndicator={false}
			showsHorizontalScrollIndicator={false}
			decelerationRate="fast"
			snapToInterval={cardWidth + 10}
			snapToAlignment="start"
			contentContainerStyle={{
				alignItems: 'flex-start',
				gap: 10,
			}}
		>
			{places.map((place) => (
				<PlaceCard
					key={place.id}
					place={place}
					width={cardWidth}
					onPress={() => handleItemPress(place)}
				/>
			))}
		</ScrollView>
	);
};

export default PlacesDisplay;
