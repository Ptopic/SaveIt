import { IPlace } from '@/api/imports/types';
import Button from '@/components/Button';
import Subtitle from '@/components/Subtitle';
import Text from '@/components/Text';
import Title from '@/components/Title';
import CategoryBadge from '@/feature/map/CategoryBadge';
import InfoBox from '@/feature/map/InfoBox';
import {
	CloseIcon,
	LinkIcon,
	OpenInGoogleMapsIcon,
	PhoneIcon,
	StarIcon,
} from '@/shared/svgs';
import { getDeviceWidth } from '@/utils/device';
import { getTailwindHexColor } from '@/utils/getTailwindColor';
import { router } from 'expo-router';
import React from 'react';
import { Linking, ScrollView, TouchableOpacity, View } from 'react-native';

interface IProps {
	place: IPlace;
	handleCloseModal: () => void;
}

const PlaceDetailsModal = ({ place, handleCloseModal }: IProps) => {
	const width = getDeviceWidth();

	const cardWidth = width - 30;

	const buttonsWidth = width / 3 - 10;

	const placeLocationData = place.importLocation?.location;

	return (
		<ScrollView showsVerticalScrollIndicator={false}>
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
					{placeLocationData?.flag}{' '}
					{placeLocationData?.city || placeLocationData?.country}
				</Text>
				<Text className="text-gray500">{placeLocationData?.address}</Text>
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
				{placeLocationData?.reviewsAverage && (
					<View className="flex-row items-center gap-2">
						<StarIcon
							width={16}
							height={16}
							color={getTailwindHexColor('yellow500')}
						/>
						<View className="flex flex-row gap-2 items-center">
							<Text className="body-medium-bold">
								{placeLocationData?.reviewsAverage}
							</Text>
							{placeLocationData?.reviewsCount && (
								<Text className="text-gray500">
									{placeLocationData?.reviewsCount} reviews
								</Text>
							)}
						</View>
					</View>
				)}
				{placeLocationData?.priceRange && (
					<View className="flex-row items-center gap-2">
						<Text className="body-medium-regular">Price range:</Text>
						<Text className="text-green400 text-medium-regular">
							{placeLocationData?.priceRange}
						</Text>
					</View>
				)}
				{placeLocationData?.description && (
					<Text>{placeLocationData?.description}</Text>
				)}
				<View className="flex-row items-center gap-2">
					{placeLocationData.locationLink && (
						<TouchableOpacity
							onPress={() => {
								Linking.openURL(placeLocationData.locationLink);
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
					{placeLocationData.phone && (
						<TouchableOpacity
							onPress={() => {
								Linking.openURL(`tel:${placeLocationData.phone}`);
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
					{placeLocationData.website && (
						<TouchableOpacity
							onPress={() => {
								Linking.openURL(placeLocationData.website);
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
					{place.importLocation?.highlights && (
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
								{place.importLocation?.highlights.map(
									(placeHighlight, index) => (
										<InfoBox
											key={index}
											text={placeHighlight.highlight as string}
											width={cardWidth}
										/>
									)
								)}
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
								snapToInterval={cardWidth + 10}
								snapToAlignment="start"
								contentContainerStyle={{
									alignItems: 'center',
									justifyContent: 'center',
									gap: 10,
								}}
							>
								{place.importLocation?.tips.map((placeTip, index) => (
									<InfoBox
										key={index}
										text={placeTip.tip as string}
										width={cardWidth}
									/>
								))}
							</ScrollView>
						</View>
					)}
					{placeLocationData?.bestTimeToVisit && (
						<InfoBox
							text={placeLocationData?.bestTimeToVisit}
							width={cardWidth}
							title="Best Time to Visit"
							emoji={'🗓️'}
						/>
					)}
					{placeLocationData?.openingHours && (
						<InfoBox
							text={placeLocationData?.openingHours}
							width={cardWidth}
							title="Opening Hours"
							emoji={'🕒'}
						/>
					)}
					<Button
						text="View on Map"
						onPress={() => {
							router.push(
								`/map?latitude=${
									placeLocationData?.coordinates.split(',')[0]
								}&longitude=${
									placeLocationData?.coordinates.split(',')[1]
								}&importId=${place.importId}`
							);
						}}
					/>
				</View>
			</View>
			<View className="h-[20px]" />
		</ScrollView>
	);
};

export default PlaceDetailsModal;
