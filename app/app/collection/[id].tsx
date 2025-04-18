import useDeleteCollection from '@/api/collection/hooks/useDeleteCollection';
import useGetCollection from '@/api/collection/hooks/useGetCollection';
import { COLLECTIONS } from '@/api/constants';
import CollectionCard from '@/components/CollectionCard';
import DrawerModal from '@/components/DrawerModal';
import ModalComponent from '@/components/ModalComponent';
import ScreenHeader from '@/components/ScreenHeader';
import Search from '@/components/Search';
import Subtitle from '@/components/Subtitle';
import Text from '@/components/Text';
import EditCollectionForm from '@/feature/user/EditCollectionForm';
import useDebounce from '@/hooks/useDebounce';
import {
	LockClosedIcon,
	LockOpenIcon,
	PencilIcon,
	PlusIcon,
	ThreeDotsIcon,
	TrashIcon,
} from '@/shared/svgs';
import { getTailwindHexColor } from '@/utils/getTailwindColor';
import BottomSheet from '@gorhom/bottom-sheet';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
	ActivityIndicator,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToast } from 'react-native-toast-notifications';

type CollectionRouteProp = RouteProp<{ params: { id: string } }, 'params'>;

const CollectionScreen = () => {
	const toast = useToast();
	const queryClient = useQueryClient();

	const route = useRoute<CollectionRouteProp>();
	const { id } = route.params;

	const bottomSheetRef = useRef<BottomSheet>(null);

	const { data: collection, isLoading: isCollectionLoading } =
		useGetCollection(id);

	const { mutate: deleteCollection, isPending: isDeletingCollection } =
		useDeleteCollection(id);

	const [collectionActionsModalVisible, setCollectionActionsModalVisible] =
		useState(false);

	const [search, setSearch] = useState('');

	const debouncedSearchValue = useDebounce(search, 600);

	const handleEditCollection = () => {
		setCollectionActionsModalVisible(false);
		bottomSheetRef.current?.expand();
	};

	const handleDeleteCollection = () => {
		deleteCollection(undefined, {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: [COLLECTIONS] });
				toast.show('Collection deleted successfully', { type: 'success' });
				router.replace('/user');
			},
			onError: () => {
				toast.show('Failed to delete collection', { type: 'error' });
			},
		});
	};

	useEffect(() => {
		if (!collection && !isCollectionLoading) {
			router.replace('/not-found' as any);
		}
	}, [collection, isCollectionLoading]);

	return (
		<SafeAreaView className="flex-1 bg-white">
			<View className="p-4 gap-5">
				<ScreenHeader
					title="Collection Details"
					rightElement={
						<TouchableOpacity
							onPress={() => setCollectionActionsModalVisible(true)}
						>
							<ThreeDotsIcon color="black" width={20} height={20} />
						</TouchableOpacity>
					}
				/>

				{isCollectionLoading ? (
					<ActivityIndicator />
				) : (
					<View className="flex-col gap-4">
						<View className="items-center justify-center gap-4">
							<CollectionCard
								id={Number(collection?.id)}
								name={collection?.name ?? ''}
								image={collection?.image ?? ''}
								isPublic={collection?.isPublic ?? false}
								height={240}
								width={200}
								hideOverlay
								disableLink
							/>

							<View className="gap-2 flex-row items-center">
								<Subtitle>{collection?.name}</Subtitle>
								{collection?.isPublic ? (
									<LockOpenIcon color="black" width={20} height={20} />
								) : (
									<LockClosedIcon color="black" width={20} height={20} />
								)}
							</View>
						</View>

						<TouchableOpacity className="bg-black p-2 rounded-lg self-start flex-row items-center">
							<View className="flex-row items-center gap-2 pr-2">
								<PlusIcon color="white" width={20} height={20} />
								<Text className="text-white">Add Imports</Text>
							</View>
						</TouchableOpacity>

						<Search
							value={search}
							onChangeText={(text) => setSearch(text)}
							placeholder="Search"
						/>
					</View>
				)}
			</View>
			<ModalComponent
				modalVisible={collectionActionsModalVisible}
				setModalVisible={setCollectionActionsModalVisible}
				overlayStyle={styles.modalOverlay}
				modalStyle={styles.modalContainer}
			>
				<View>
					<View className="flex-col mb-[10] rounded-lg bg-gray100">
						<TouchableOpacity
							className="p-[10] flex-row items-center gap-2 justify-center"
							onPress={handleEditCollection}
						>
							<PencilIcon color="black" width={20} height={20} />
							<Text className="text-black text-lg font-bold">
								Edit Collection
							</Text>
						</TouchableOpacity>
						<View className="h-[1] bg-gray300"></View>
						<TouchableOpacity
							className="p-[10] flex-row items-center gap-2 justify-center"
							onPress={handleDeleteCollection}
						>
							<TrashIcon
								color={getTailwindHexColor('red500')}
								width={20}
								height={20}
							/>
							<Text className="text-red500 text-lg font-bold">
								Delete Collection
							</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity
						onPress={() => setCollectionActionsModalVisible(false)}
						className="bg-white rounded-lg p-[10] justify-center items-center"
					>
						<Text className="text-red500 text-lg font-bold">Cancel</Text>
					</TouchableOpacity>
				</View>
			</ModalComponent>
			<DrawerModal ref={bottomSheetRef} snapPoints={['70%']}>
				{!isCollectionLoading && collection ? (
					<EditCollectionForm
						closeModal={() => bottomSheetRef.current?.close()}
						collection={collection}
					/>
				) : (
					<ActivityIndicator />
				)}
			</DrawerModal>
		</SafeAreaView>
	);
};

export default CollectionScreen;

const styles = StyleSheet.create({
	modalOverlay: {
		justifyContent: 'flex-end',
	},
	modalContainer: {
		width: '100%',
		paddingBottom: 40,
		paddingHorizontal: 10,
		backgroundColor: 'transparent',
	},
});
