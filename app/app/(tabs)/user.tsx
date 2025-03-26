import useGetUserInfo from '@/api/auth/hooks/useGetUserInfo';
import useGetAllCollections from '@/api/collection/hooks/useGetAllCollections';
import { COLLECTIONS, DEFAULT_PAGE } from '@/api/constants';
import CollectionCard from '@/components/CollectionCard';
import DrawerModal from '@/components/DrawerModal';
import ExtractCard from '@/components/ExtractCard';
import Subtitle from '@/components/Subtitle';
import Title from '@/components/Title';
import CreateCollectionForm from '@/feature/user/CreateCollectionForm';
import BottomSheet from '@gorhom/bottom-sheet';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
	ActivityIndicator,
	Image,
	RefreshControl,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import OctiIcon from 'react-native-vector-icons/Octicons';

export default function TabUserScreen() {
	const queryClient = useQueryClient();

	const COLLECTIONS_PAGE_SIZE = '6';

	const [refreshing, setRefreshing] = useState(false);

	const bottomSheetRef = useRef<BottomSheet>(null);

	const { data: userInfo, isLoading: isUserInfoLoading } = useGetUserInfo();

	const {
		data: collections,
		isLoading: isCollectionsLoading,
		isFetching: isCollectionsFetching,
	} = useGetAllCollections({
		page: DEFAULT_PAGE,
		searchQuery: '',
		pageSize: COLLECTIONS_PAGE_SIZE,
	});

	const onRefresh = async () => {
		setRefreshing(true);
		await queryClient.invalidateQueries({ queryKey: [COLLECTIONS] });
		setRefreshing(false);
	};

	return (
		<SafeAreaView className="flex-1">
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
				{isUserInfoLoading ? (
					<ActivityIndicator />
				) : (
					<View className="flex-col gap-5">
						<View className="flex-row justify-between items-center">
							<Title>{userInfo?.name}</Title>
							<Link href={'/settings' as any}>
								<Icon name="settings" size={20} color="black" />
							</Link>
						</View>

						<View className="flex-row gap-5 items-center">
							{userInfo?.picture ? (
								<Image
									source={{ uri: userInfo.picture }}
									className="w-[85] h-[85] rounded-full bg-lightgray"
								/>
							) : (
								<View className="w-[85] h-[85] rounded-full bg-lightgray"></View>
							)}
							<View>
								<Text>7</Text>
								<Text>Media Saved</Text>
							</View>
						</View>

						<View className="flex-row gap-2 items-center">
							<Text>📍</Text>
							<Text>Location</Text>
						</View>

						<Link
							href={'/profile' as any}
							className="bg-lightgray p-2 rounded-md"
						>
							<Text className="text-white text-center">Edit Profile</Text>
						</Link>

						<View className="flex-row justify-between items-center">
							<TouchableOpacity className="flex-row gap-2 items-center">
								<Subtitle>My Collections</Subtitle>
								<Icon name="arrow-forward-ios" size={14} color="lightgray" />
							</TouchableOpacity>
							<TouchableOpacity
								className="bg-lightgray rounded-full w-[30] h-[30] justify-center items-center"
								onPress={() => bottomSheetRef.current?.expand()}
							>
								<OctiIcon name="plus" size={14} color="white" />
							</TouchableOpacity>
						</View>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={{ gap: 10 }}
						>
							{isCollectionsLoading || isCollectionsFetching ? (
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
								bgColor="lightgray"
								textColor="white"
								url="/category/restaurants"
							/>
							<ExtractCard
								title="Places"
								icon={
									<FontAwesomeIcon
										name="location-arrow"
										size={16}
										color="white"
									/>
								}
								bgColor="lightgray"
								textColor="white"
								url="/category/places"
							/>
							<ExtractCard
								title="Recipes"
								icon={<FontAwesomeIcon name="book" size={16} color="white" />}
								bgColor="lightgray"
								textColor="white"
								url="/category/recipes"
							/>
							<ExtractCard
								title="Products"
								iconName="shopping-cart"
								bgColor="lightgray"
								textColor="white"
								url="/category/products"
							/>
							<ExtractCard
								title="Events"
								iconName="event"
								bgColor="lightgray"
								textColor="white"
								url="/category/events"
							/>
							<ExtractCard
								title="Workout routines"
								icon={
									<FontAwesomeIcon name="dumbbell" size={16} color="white" />
								}
								bgColor="lightgray"
								textColor="white"
								url="/category/workout-routines"
							/>
							<ExtractCard
								title="Books"
								icon={<Ionicons name="book" size={20} color="white" />}
								bgColor="lightgray"
								textColor="white"
								url="/category/books"
							/>
							<ExtractCard
								title="Films and shows"
								iconName="movie"
								bgColor="lightgray"
								textColor="white"
								url="/category/films-and-shows"
							/>
							<ExtractCard
								title="Software"
								iconName="code"
								bgColor="lightgray"
								textColor="white"
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
