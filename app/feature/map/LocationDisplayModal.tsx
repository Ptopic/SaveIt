import { ILocation } from '@/api/locations/types';
import Subtitle from '@/components/Subtitle';
import Text from '@/components/Text';
import Title from '@/components/Title';
import {
	CloseIcon,
	LinkIcon,
	OpenInGoogleMapsIcon,
	PhoneIcon,
	StarIcon,
} from '@/shared/svgs';
import { getDeviceWidth } from '@/utils/device';
import { getTailwindHexColor } from '@/utils/getTailwindColor';
import { Linking, ScrollView, TouchableOpacity, View } from 'react-native';
import CategoryBadge from './CategoryBadge';
import InfoBox from './InfoBox';

interface IProps {
	selectedLocation: ILocation;
	onLocationDetailsClose: () => void;
}

const width = getDeviceWidth();

const cardWidth = width - 30;

const buttonsWidth = width / 3 - 10;

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
			<View className="flex-1 flex-col gap-2">
				<Title>{selectedLocation?.name}</Title>
				<Text>
					{selectedLocation?.flag}{' '}
					{selectedLocation?.city || selectedLocation?.country}
				</Text>
				<Text className="text-gray500">{selectedLocation?.address}</Text>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ gap: 10 }}
				>
					{selectedLocation?.categories &&
						selectedLocation?.categories.map((category, index) => (
							<CategoryBadge key={index} category={category} />
						))}
				</ScrollView>
				{selectedLocation?.reviewsAverage && (
					<View className="flex-row items-center gap-2">
						<StarIcon
							width={16}
							height={16}
							color={getTailwindHexColor('yellow500')}
						/>
						<View className="flex flex-row gap-2 items-center">
							<Text className="body-medium-bold">
								{selectedLocation?.reviewsAverage}
							</Text>
							{selectedLocation?.reviewsCount && (
								<Text className="text-gray500">
									{selectedLocation?.reviewsCount} reviews
								</Text>
							)}
						</View>
					</View>
				)}
				{selectedLocation?.priceRange && (
					<View className="flex-row items-center gap-2">
						<Text className="body-medium-regular">Price range:</Text>
						<Text className="text-green400 text-medium-regular">
							{selectedLocation?.priceRange}
						</Text>
					</View>
				)}
				{selectedLocation?.description && (
					<Text>{selectedLocation?.description}</Text>
				)}
				<View className="flex-row items-center gap-2">
					{selectedLocation.locationLink && (
						<TouchableOpacity
							onPress={() => {
								Linking.openURL(selectedLocation.locationLink);
							}}
							style={{ width: buttonsWidth }}
							className="flex flex-col gap-2 items-center bg-gray100 rounded-md justify-center px-2 py-3"
						>
							<OpenInGoogleMapsIcon
								width={16}
								height={16}
								color={getTailwindHexColor('black')}
							/>
							<Text className="text-black">GMaps</Text>
						</TouchableOpacity>
					)}
					{selectedLocation.phone && (
						<TouchableOpacity
							onPress={() => {
								Linking.openURL(`tel:${selectedLocation.phone}`);
							}}
							style={{ width: buttonsWidth }}
							className="flex flex-col gap-2 items-center bg-gray100 rounded-md justify-center px-2 py-3"
						>
							<PhoneIcon
								width={16}
								height={16}
								color={getTailwindHexColor('black')}
							/>
							<Text className="text-black">Call</Text>
						</TouchableOpacity>
					)}
					{selectedLocation.website && (
						<TouchableOpacity
							onPress={() => {
								Linking.openURL(selectedLocation.website);
							}}
							style={{ width: buttonsWidth }}
							className="flex flex-col gap-2 items-center bg-gray100 rounded-md justify-center px-2 py-3"
						>
							<LinkIcon
								width={16}
								height={16}
								color={getTailwindHexColor('black')}
							/>
							<Text className="text-black">Website</Text>
						</TouchableOpacity>
					)}
				</View>
				<View className="flex-col gap-4">
					{selectedLocation?.highlights && (
						<View className="flex-col gap-2">
							<Subtitle>Highlights</Subtitle>
							<ScrollView
								horizontal
								showsVerticalScrollIndicator={false}
								showsHorizontalScrollIndicator={false}
								decelerationRate="fast"
								snapToInterval={cardWidth + 10}
								snapToAlignment="start"
								contentContainerStyle={{
									alignItems: 'center',
									justifyContent: 'center',
									gap: 10,
								}}
							>
								{selectedLocation?.highlights.map((highlight, index) => (
									<InfoBox key={index} text={highlight} width={cardWidth} />
								))}
							</ScrollView>
						</View>
					)}
					{selectedLocation?.tips && (
						<View className="flex-col gap-2">
							<Subtitle>Tips</Subtitle>
							<ScrollView
								horizontal
								showsVerticalScrollIndicator={false}
								showsHorizontalScrollIndicator={false}
								decelerationRate="fast"
								snapToInterval={cardWidth + 10}
								snapToAlignment="start"
								contentContainerStyle={{
									alignItems: 'center',
									justifyContent: 'center',
									gap: 10,
								}}
							>
								{selectedLocation?.tips.map((tip, index) => (
									<InfoBox key={index} text={tip} width={cardWidth} />
								))}
							</ScrollView>
						</View>
					)}
					{selectedLocation?.bestTimeToVisit && (
						<InfoBox
							text={selectedLocation?.bestTimeToVisit}
							width={cardWidth}
							title="Best Time to Visit"
							emoji={'🗓️'}
						/>
					)}
					{selectedLocation?.openingHours && (
						<InfoBox
							text={selectedLocation?.openingHours}
							width={cardWidth}
							title="Opening Hours"
							emoji={'🕒'}
						/>
					)}
				</View>
			</View>
			<View className="h-[20px]" />
		</ScrollView>
	);
};

export default LocationDisplayModal;
