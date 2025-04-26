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
import { Linking, ScrollView, TouchableOpacity, View } from 'react-native';
import Subtitle from './Subtitle';
import Text from './Text';
import Title from './Title';

interface IProps {
	data: any;
}

const LocationDisplay = ({ data }: IProps) => {
	const width = getDeviceWidth();

	const cardWidth = width - 30;

	const buttonsWidth = width / 3 - 10;

	return (
		<View className="flex-1 flex-col gap-2">
			<Title>{data.name}</Title>
			<Text>
				{data.flag} {data.city || data.country}
			</Text>
			{data.address && <Text className="text-gray500">{data.address}</Text>}
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ gap: 10 }}
			>
				{data?.categories?.length > 0 &&
					data?.categories.map((category: any, index: any) => (
						<CategoryBadge key={index} category={category} />
					))}
			</ScrollView>
			{data.reviewsAverage && (
				<View className="flex-row items-center gap-2">
					<StarIcon
						width={16}
						height={16}
						color={getTailwindHexColor('yellow500')}
					/>
					<View className="flex flex-row gap-2 items-center">
						<Text className="body-medium-bold">{data.reviewsAverage}</Text>
						{data.reviewsCount && (
							<Text className="text-gray500">{data.reviewsCount} reviews</Text>
						)}
					</View>
				</View>
			)}
			{data.priceRange && (
				<View className="flex-row items-center gap-2">
					<Text className="body-medium-regular">Price range:</Text>
					<Text className="text-green400 text-medium-regular">
						{data.priceRange}
					</Text>
				</View>
			)}
			{data.description && <Text>{data.description}</Text>}
			<View className="flex-row items-center gap-2">
				{data.locationLink && (
					<TouchableOpacity
						onPress={() => {
							Linking.openURL(data.locationLink);
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
				{data.phone && (
					<TouchableOpacity
						onPress={() => {
							Linking.openURL(`tel:${data.phone}`);
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
				{data.website && (
					<TouchableOpacity
						onPress={() => {
							Linking.openURL(data.website);
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
								<InfoBox key={index} text={dish} width={cardWidth} />
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
								<InfoBox key={index} text={highlight} width={cardWidth} />
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
								<InfoBox key={index} text={tip} width={cardWidth} />
							))}
						</ScrollView>
					</View>
				)}
				{data.bestTimeToVisit && (
					<InfoBox
						text={data.bestTimeToVisit}
						width={cardWidth}
						title="Best Time to Visit"
						emoji={'🗓️'}
					/>
				)}
				{data.openingHours && (
					<InfoBox
						text={data.openingHours}
						width={cardWidth}
						title="Opening Hours"
						emoji={'🕒'}
					/>
				)}
			</View>
		</View>
	);
};

export default LocationDisplay;
