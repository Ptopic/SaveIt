import { IPlace } from '@/api/imports/types';
import Button from '@/components/Button';
import Subtitle from '@/components/Subtitle';
import Text from '@/components/Text';
import Title from '@/components/Title';
import CategoryBadge from '@/feature/map/CategoryBadge';
import InfoBox from '@/feature/map/InfoBox';
import { CloseIcon } from '@/shared/svgs';
import { getDeviceWidth } from '@/utils/device';
import { getTailwindHexColor } from '@/utils/getTailwindColor';
import { router } from 'expo-router';
import { ScrollView, TouchableOpacity, View } from 'react-native';

interface IProps {
	place: IPlace;
	handleCloseModal: () => void;
}

const PlaceDetailsModal = ({ place, handleCloseModal }: IProps) => {
	const width = getDeviceWidth();

	const cardWidth = width - 30;

	return (
		<ScrollView showsVerticalScrollIndicator={false} className="pb-5">
			<View className="flex-row justify-between items-center">
				<View className="w-12 h-12 rounded-full bg-gray50 border border-gray200 items-center justify-center">
					<Text className="text-lg">{place?.emoji}</Text>
				</View>
				<TouchableOpacity
					className="bg-red100 rounded-full w-[30] h-[30] justify-center items-center"
					onPress={() => {
						handleCloseModal();
					}}
				>
					<CloseIcon
						width={20}
						height={20}
						color={getTailwindHexColor('red400')}
					/>
				</TouchableOpacity>
			</View>
			<View className="flex-1 flex-col gap-2">
				<Title>{place.name}</Title>
				<Text>
					{place.importLocation?.flag + ' ' + place.importLocation?.city}
				</Text>
				<Text className="text-gray500">{place.importLocation?.address}</Text>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ gap: 10 }}
				>
					{place.importLocation?.categories &&
						place.importLocation?.categories.map((placeCategory, index) => (
							<CategoryBadge key={index} category={placeCategory.category} />
						))}
				</ScrollView>
				<Text>{place.importLocation?.description}</Text>
				<View className="flex-col gap-4">
					{place.importLocation?.highlights && (
						<View className="flex-col gap-2">
							<Subtitle>Highlights</Subtitle>
							<ScrollView
								horizontal
								showsVerticalScrollIndicator={false}
								showsHorizontalScrollIndicator={false}
								decelerationRate="fast"
								snapToInterval={cardWidth + 15}
								snapToAlignment="start"
								contentContainerStyle={{
									alignItems: 'flex-start',
									gap: 10,
								}}
							>
								<View className="flex-row items-stretch gap-2">
									{place.importLocation?.highlights.map(
										(placeHighlight, index) => (
											<InfoBox
												key={index}
												text={placeHighlight.highlight as string}
												width={cardWidth}
											/>
										)
									)}
								</View>
							</ScrollView>
						</View>
					)}
					{place.importLocation?.tips && (
						<View className="flex-col gap-2">
							<Subtitle>Tips</Subtitle>
							<ScrollView
								horizontal
								showsVerticalScrollIndicator={false}
								showsHorizontalScrollIndicator={false}
								decelerationRate="fast"
								snapToInterval={cardWidth + 15}
								snapToAlignment="start"
								contentContainerStyle={{
									alignItems: 'flex-start',
									gap: 10,
								}}
							>
								<View className="flex-row items-stretch gap-2">
									{place.importLocation?.tips.map((placeTip, index) => (
										<InfoBox
											key={index}
											text={placeTip.tip as string}
											width={cardWidth}
										/>
									))}
								</View>
							</ScrollView>
						</View>
					)}
					{place.importLocation?.bestTimeToVisit && (
						<InfoBox
							text={place.importLocation?.bestTimeToVisit}
							width={cardWidth}
							title="Best Time to Visit"
							emoji={'🗓️'}
						/>
					)}
					{place.importLocation?.openingHours && (
						<InfoBox
							text={place.importLocation?.openingHours}
							width={cardWidth}
							title="Opening Hours"
							emoji={'🕒'}
						/>
					)}
					<Button
						text="Open in Map"
						onPress={() => {
							router.push(
								`/map?latitude=${
									place.importLocation?.coordinates.split(',')[0]
								}&longitude=${
									place.importLocation?.coordinates.split(',')[1]
								}&importId=${place.importId}`
							);
						}}
					/>
				</View>
			</View>
		</ScrollView>
	);
};

export default PlaceDetailsModal;
