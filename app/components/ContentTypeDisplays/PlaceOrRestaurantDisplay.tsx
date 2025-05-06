import CategoryBadge from '@/feature/map/CategoryBadge';
import InfoBox from '@/feature/map/InfoBox';
import {
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
import Button from '../Button';
import Subtitle from '../Subtitle';
import Text from '../Text';
import Title from '../Title';

interface IProps {
	data: any;
}

const PlaceOrRestaurantDisplay = ({ data }: IProps) => {
	const width = getDeviceWidth();

	const cardWidth = width - 30;

	const buttonsWidth = width / 3 - 10;

	return (
		<View className="flex-1 flex-col gap-2">
			<Title>{data.name}</Title>
			<Text>
				{data.location?.flag} {data.location?.city || data.location?.country}
			</Text>
			{data.location?.address && (
				<Text className="text-gray500">{data.location?.address}</Text>
			)}
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ gap: 10 }}
			>
				{data?.categories &&
					data?.categories.map((category: any, index: any) => (
						<CategoryBadge key={index} category={category.category} />
					))}
			</ScrollView>
			{data.location?.reviewsAverage && (
				<View className="flex-row items-center gap-2">
					<StarIcon
						width={16}
						height={16}
						color={getTailwindHexColor('yellow500')}
					/>
					<View className="flex flex-row gap-2 items-center">
						<Text className="body-medium-bold">
							{data.location?.reviewsAverage}
						</Text>
						{data.location?.reviewsCount && (
							<Text className="text-gray500">
								{data.location?.reviewsCount} reviews
							</Text>
						)}
					</View>
				</View>
			)}
			{data.location?.priceRange && (
				<View className="flex-row items-center gap-2">
					<Text className="body-medium-regular">Price range:</Text>
					<Text className="text-green400 text-medium-regular">
						{data.location?.priceRange}
					</Text>
				</View>
			)}
			{data.location?.description && <Text>{data.location?.description}</Text>}
			<View className="flex-row items-center gap-2">
				{data.location?.locationLink && (
					<TouchableOpacity
						onPress={() => {
							Linking.openURL(data.location.locationLink);
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
				{data.location?.phone && (
					<TouchableOpacity
						onPress={() => {
							Linking.openURL(`tel:${data.location.phone}`);
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
				{data.location?.website && (
					<TouchableOpacity
						onPress={() => {
							Linking.openURL(data.location.website);
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
				{data?.mustTryDishes && data?.mustTryDishes.length > 0 && (
					<View className="flex-col gap-2">
						<Subtitle>Must Try Dishes</Subtitle>
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
							{data?.mustTryDishes.map((dish: any, index: any) => (
								<InfoBox
									key={index}
									text={dish.dish as string}
									width={cardWidth}
								/>
							))}
						</ScrollView>
					</View>
				)}
				{data?.highlights && data?.highlights.length > 0 && (
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
							{data?.highlights.map((highlight: any, index: any) => (
								<InfoBox
									key={index}
									text={highlight.highlight as string}
									width={cardWidth}
								/>
							))}
						</ScrollView>
					</View>
				)}
				{data?.tips && data?.tips.length > 0 && (
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
							{data?.tips.map((tip: any, index: any) => (
								<InfoBox
									key={index}
									text={tip.tip as string}
									width={cardWidth}
								/>
							))}
						</ScrollView>
					</View>
				)}
				{data.location?.bestTimeToVisit && (
					<InfoBox
						text={data.location?.bestTimeToVisit}
						width={cardWidth}
						title="Best Time to Visit"
						emoji={'🗓️'}
					/>
				)}
				{data.location?.openingHours && (
					<InfoBox
						text={data.location?.openingHours}
						width={cardWidth}
						title="Opening Hours"
						emoji={'🕒'}
					/>
				)}
				{data.location?.coordinates && (
					<Button
						text="View on Map"
						onPress={() => {
							router.push(
								`/map?latitude=${
									data.location?.coordinates.split(',')[0]
								}&longitude=${
									data.location?.coordinates.split(',')[1]
								}&importId=${data.importId}`
							);
						}}
					/>
				)}
			</View>
		</View>
	);
};

export default PlaceOrRestaurantDisplay;
