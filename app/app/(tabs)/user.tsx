import useGetUserInfo from '@/api/auth/hooks/useGetUserInfo';
import useGetAllCollections from '@/api/collection/hooks/useGetAllCollections';
import { COLLECTIONS, DEFAULT_PAGE, USER_INFO } from '@/api/constants';
import CollectionCard from '@/components/CollectionCard';
import DrawerModal from '@/components/DrawerModal';
import ExtractCard from '@/components/ExtractCard';
import Subtitle from '@/components/Subtitle';
import Text from '@/components/Text';
import Title from '@/components/Title';
import CreateCollectionForm from '@/feature/user/CreateCollectionForm';
import { blurhash } from '@/shared/contants';
import { ChevronRightIcon, PlusIcon, SettingsIcon } from '@/shared/svgs';
import { getTailwindHexColor } from '@/utils/getTailwindColor';
import BottomSheet from '@gorhom/bottom-sheet';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useRef, useState } from 'react';
import {
	ActivityIndicator,
	RefreshControl,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function TabUserScreen() {
	const queryClient = useQueryClient();

	const COLLECTIONS_PAGE_SIZE = '6';

	const [refreshing, setRefreshing] = useState(false);

	const bottomSheetRef = useRef<BottomSheet>(null);

	const {
		data: userInfo,
		isLoading: isUserInfoLoading,
		isFetching: isUserInfoFetching,
		isRefetching: isUserInfoRefetching,
	} = useGetUserInfo();

	const {
		data: collections,
		isLoading: isCollectionsLoading,
		isFetching: isCollectionsFetching,
		isRefetching: isCollectionsRefetching,
	} = useGetAllCollections({
		page: DEFAULT_PAGE,
		searchQuery: '',
		pageSize: COLLECTIONS_PAGE_SIZE,
	});

	const onRefresh = async () => {
		setRefreshing(true);
		await Promise.all([
			queryClient.invalidateQueries({ queryKey: [USER_INFO] }),
			queryClient.invalidateQueries({ queryKey: [COLLECTIONS] }),
		]);
		setRefreshing(false);
	};

	return (
		<SafeAreaView className="flex-1 bg-white">
			<ScrollView
				className="p-[15]"
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						colors={['black']}
					/>
				}
			>
				{isUserInfoLoading || isUserInfoFetching || isUserInfoRefetching ? (
					<ActivityIndicator />
				) : (
					<View className="flex-col gap-5">
						<View className="flex-row justify-between items-center">
							<Title>{userInfo?.name}</Title>
							<Link href={'/settings' as any}>
								<SettingsIcon width={24} height={24} color="black" />
							</Link>
						</View>

						<View className="flex-row gap-6 items-center">
							{userInfo?.picture ? (
								<Image
									source={{ uri: userInfo.picture }}
									style={styles.image}
									contentFit="cover"
									placeholder={blurhash}
									transition={500}
								/>
							) : (
								<View className="w-[85] h-[85] rounded-full bg-gray200"></View>
							)}
							<View>
								<Text className="heading-xxsmall">7</Text>
								<Text className="body-small-regular">Media Saved</Text>
							</View>
						</View>

						{userInfo?.location && (
							<View className="flex-row gap-2 items-center">
								<Text>📍</Text>
								<Text className="body-small-regular">Location</Text>
							</View>
						)}

						<Link
							href={'/profile' as any}
							className="bg-gray200 p-2 rounded-md"
						>
							<Text className="text-black text-center body-medium-regular">
								Edit Profile
							</Text>
						</Link>

						<View className="flex-row justify-between items-center">
							<TouchableOpacity className="flex-row gap-2 items-center">
								<Subtitle>My Collections</Subtitle>
								<ChevronRightIcon
									width={16}
									height={16}
									color={getTailwindHexColor('gray600')}
								/>
							</TouchableOpacity>
							<TouchableOpacity
								className="bg-red100 rounded-full w-[30] h-[30] justify-center items-center"
								onPress={() => bottomSheetRef.current?.expand()}
							>
								<PlusIcon
									width={18}
									height={18}
									color={getTailwindHexColor('red400')}
								/>
							</TouchableOpacity>
						</View>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={{ gap: 10 }}
						>
							{isCollectionsLoading ||
							isCollectionsFetching ||
							isCollectionsRefetching ? (
								<ActivityIndicator color="black" />
							) : (
								collections?.data &&
								collections?.data.length > 0 &&
								collections?.data.map((collection: any, index: number) => (
									<CollectionCard
										key={index}
										id={collection.id}
										name={collection.name}
										image={collection.image}
									/>
								))
							)}
						</ScrollView>
						<View>
							<Subtitle>Extracts</Subtitle>
						</View>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={{ gap: 10 }}
						>
							<ExtractCard
								title="Restaurants"
								iconName="local-restaurant"
								bgColor="yellow100"
								textColor="yellow400"
								url="/category/restaurants"
							/>
							<ExtractCard
								title="Places"
								icon={
									<FontAwesomeIcon
										name="location-arrow"
										size={16}
										color={getTailwindHexColor('blue400')}
									/>
								}
								bgColor="blue100"
								textColor="blue400"
								url="/category/places"
							/>
							<ExtractCard
								title="Recipes"
								icon={
									<FontAwesomeIcon
										name="book"
										size={16}
										color={getTailwindHexColor('orange400')}
									/>
								}
								bgColor="orange100"
								textColor="orange400"
								url="/category/recipes"
							/>
							<ExtractCard
								title="Products"
								iconName="shopping-cart"
								bgColor="red100"
								textColor="red400"
								url="/category/products"
							/>
							<ExtractCard
								title="Events"
								iconName="event"
								bgColor="purple100"
								textColor="purple400"
								url="/category/events"
							/>
							<ExtractCard
								title="Workout routines"
								icon={
									<FontAwesomeIcon
										name="dumbbell"
										size={16}
										color={getTailwindHexColor('green400')}
									/>
								}
								bgColor="green100"
								textColor="green400"
								url="/category/workout-routines"
							/>
							<ExtractCard
								title="Books"
								icon={
									<Ionicons
										name="book"
										size={20}
										color={getTailwindHexColor('brown400')}
									/>
								}
								bgColor="brown100"
								textColor="brown400"
								url="/category/books"
							/>
							<ExtractCard
								title="Films and shows"
								iconName="movie"
								bgColor="purple100"
								textColor="purple400"
								url="/category/films-and-shows"
							/>
							<ExtractCard
								title="Software"
								iconName="code"
								bgColor="sky100"
								textColor="sky400"
								url="/category/software"
							/>
						</ScrollView>
					</View>
				)}
			</ScrollView>
			<DrawerModal ref={bottomSheetRef} snapPoints={['80%']}>
				<CreateCollectionForm
					closeModal={() => bottomSheetRef.current?.close()}
				/>
			</DrawerModal>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	image: {
		width: 85,
		height: 85,
		borderRadius: 42.5,
	},
});
