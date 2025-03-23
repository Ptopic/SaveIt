import CollectionCard from '@/components/CollectionCard';
import DrawerModal from '@/components/DrawerModal';
import ExtractCard from '@/components/ExtractCard';
import CreateCollectionForm from '@/feature/user/CreateCollectionForm';
import BottomSheet from '@gorhom/bottom-sheet';
import { Link } from 'expo-router';
import React, { useRef } from 'react';
import {
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
	const bottomSheetRef = useRef<BottomSheet>(null);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={styles.container}>
				<View style={styles.header}>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>Petar Topic</Text>
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
							<Text style={styles.subtitle}>My Collections</Text>
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
						<CollectionCard id={1} />
						<CollectionCard id={2} />
						<CollectionCard id={3} />
						<CollectionCard id={4} />
					</ScrollView>
					<View>
						<Text style={styles.subtitle}>Extracts</Text>
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
			</View>
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
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	subtitle: {
		fontSize: 16,
		fontWeight: 'bold',
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
