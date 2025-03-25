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
import React, { useEffect, useRef, useState } from 'react';
import {
	ActivityIndicator,
	Image,
	RefreshControl,
	SafeAreaView,
	ScrollView,
	StyleSheet,
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
	const [isImagesLoaded, setIsImagesLoaded] = useState(false);

	const bottomSheetRef = useRef<BottomSheet>(null);

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

	useEffect(() => {
		if (collections?.data?.length) {
			const validImages = collections.data
				.filter(
					(collection: any) =>
						collection.image && typeof collection.image === 'string'
				)
				.map((collection: any) => collection.image);

			// Prefetch i spremi u cache
			const preloadImages = validImages.map(async (image: any) => {
				await Image.prefetch(image);
			});

			Promise.all(preloadImages).then(() => setIsImagesLoaded(true));
		}
	}, [collections]);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ScrollView
				style={styles.container}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						colors={['black']}
					/>
				}
			>
				<View style={styles.header}>
					<View style={styles.titleContainer}>
						<Title>Petar Topic</Title>
						<Link href={'/settings' as any}>
							<Icon name="settings" size={20} color="black" />
						</Link>
					</View>

					<View style={styles.userInfoContainer}>
						<View style={styles.circle}></View>
						<View>
							<Text>7</Text>
							<Text>Media Saved</Text>
						</View>
					</View>

					<View style={styles.locationContainer}>
						<Text>📍</Text>
						<Text>Location</Text>
					</View>

					<Link href={'/profile' as any} style={styles.editButton}>
						<Text style={styles.editButtonText}>Edit Profile</Text>
					</Link>

					<View style={styles.myCollectionsContainer}>
						<TouchableOpacity style={styles.myCollectionsHeader}>
							<Subtitle>My Collections</Subtitle>
							<Icon name="arrow-forward-ios" size={14} color="lightgray" />
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.addCollectionButton}
							onPress={() => bottomSheetRef.current?.expand()}
						>
							<OctiIcon name="plus" size={14} color="white" />
						</TouchableOpacity>
					</View>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.collectionsCardsContainer}
					>
						{isCollectionsLoading ||
						isCollectionsFetching ||
						!isImagesLoaded ? (
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
						contentContainerStyle={styles.extractsCardsContainer}
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
							icon={<FontAwesomeIcon name="dumbbell" size={16} color="white" />}
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
	container: {
		padding: 15,
	},
	titleContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	circle: {
		width: 85,
		height: 85,
		borderRadius: 65,
		backgroundColor: 'lightgray',
	},
	header: {
		flexDirection: 'column',
		justifyContent: 'center',
		gap: 15,
	},
	userInfoContainer: {
		flexDirection: 'row',
		gap: 20,
		alignItems: 'center',
	},
	editButton: {
		backgroundColor: 'lightgray',
		padding: 10,
		borderRadius: 5,
	},
	editButtonText: {
		color: 'white',
		textAlign: 'center',
	},
	locationContainer: {
		flexDirection: 'row',
		gap: 5,
	},
	myCollectionsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	myCollectionsHeader: {
		flexDirection: 'row',
		gap: 5,
		alignItems: 'center',
	},
	addCollectionButton: {
		backgroundColor: 'lightgray',
		borderRadius: 75,
		width: 30,
		height: 30,
		justifyContent: 'center',
		alignItems: 'center',
	},
	collectionsCardsContainer: {
		gap: 10,
	},
	extractsCardsContainer: {
		gap: 10,
	},
	addCollectionContainer: {
		flex: 1,
	},
});
