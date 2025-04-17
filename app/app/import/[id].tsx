import { IMPORTS, LOCATIONS } from '@/api/constants';
import useDeleteImport from '@/api/imports/hooks/useDeleteImport';
import useGetImport from '@/api/imports/hooks/useGetImport';
import ModalComponent from '@/components/ModalComponent';
import SocialMediaIcon from '@/components/SocialMediaIcon';
import Subtitle from '@/components/Subtitle';
import Text from '@/components/Text';
import Title from '@/components/Title';
import FilterBadge from '@/feature/home/FilterBadge/FilterBadge';
import { blurhash } from '@/shared/contants';
import {
	ArrowLeftIcon,
	PencilIcon,
	ThreeDotsIcon,
	TrashIcon,
} from '@/shared/svgs';
import { getTailwindHexColor } from '@/utils/getTailwindColor';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ImportDetailsRouteProp = RouteProp<{ params: { id: string } }, 'params'>;

const ImportDetailsScreen = () => {
	const queryClient = useQueryClient();
	const route = useRoute<ImportDetailsRouteProp>();
	const { id } = route.params;

	const [importActionsModalVisible, setImportActionsModalVisible] =
		useState(false);

	const { data: importData, isLoading } = useGetImport(id);

	const { mutate: deleteImport } = useDeleteImport({
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [IMPORTS], exact: false });
			queryClient.invalidateQueries({ queryKey: [LOCATIONS], exact: false });
			router.back();
		},
	});

	const handleEditImportCollection = () => {
		setImportActionsModalVisible(true);
	};

	const handleDeleteImport = () => {
		deleteImport(id);
	};

	return (
		<SafeAreaView className="flex-1 p-5 gap-2">
			<TouchableOpacity
				className="flex-row items-center gap-2"
				onPress={() => router.back()}
			>
				<ArrowLeftIcon
					height={24}
					width={24}
					color={getTailwindHexColor('gray600')}
				/>
			</TouchableOpacity>
			{isLoading ? (
				<ActivityIndicator />
			) : (
				<View className="flex-col gap-4">
					{importData?.type ? (
						<>
							<View className="flex items-center justify-center">
								<Image
									source={{ uri: importData?.thumbnail }}
									style={styles.image}
									contentFit="cover"
									placeholder={blurhash}
									transition={500}
								/>
							</View>
							<FilterBadge type={importData?.type} alwaysActive />
						</>
					) : (
						<View className="flex items-center justify-center">
							<View className="h-[300px] w-[80%] bg-gray100 rounded-[15px]" />
						</View>
					)}
					{importData?.title && <Title>{importData.title}</Title>}
					<View className="flex-row gap-2">
						{importData?.videoUrl && (
							<Link
								href={importData.videoUrl as any}
								className="bg-gray100 rounded-full px-4 py-2"
							>
								<SocialMediaIcon
									socialMediaType={importData.socialMediaType}
									displayText={false}
									iconSize={20}
									color={getTailwindHexColor('black')}
								/>
							</Link>
						)}

						<TouchableOpacity
							className="bg-gray100 rounded-full px-4 py-2"
							activeOpacity={1}
							onPress={() => setImportActionsModalVisible(true)}
						>
							<ThreeDotsIcon
								height={20}
								width={20}
								color={getTailwindHexColor('black')}
							/>
						</TouchableOpacity>
					</View>
					{importData?.summary && (
						<ScrollView className="h-[30%]">
							<Text className="body-small-regular text-gray500">
								{JSON.stringify(importData.summary, null, 2)}
							</Text>
						</ScrollView>
					)}

					{importData?.status === 'Importing' && (
						<View className="flex-col gap-2 bg-gray100 rounded-lg p-4">
							<Subtitle>This import is being processed...</Subtitle>
							<Text>
								This might take a few minutes. You will get a notification once
								its processed.
							</Text>
						</View>
					)}
				</View>
			)}
			<ModalComponent
				modalVisible={importActionsModalVisible}
				setModalVisible={setImportActionsModalVisible}
				overlayStyle={styles.modalOverlay}
				modalStyle={styles.modalContainer}
			>
				<View>
					<View className="flex-col mb-[10] rounded-lg bg-gray100">
						<TouchableOpacity
							className="p-[10] flex-row items-center gap-2 justify-center"
							onPress={handleEditImportCollection}
						>
							<PencilIcon color="black" width={20} height={20} />
							<Text className="text-black text-lg font-bold">
								Edit Import Collection
							</Text>
						</TouchableOpacity>
						<View className="h-[1] bg-gray300"></View>
						<TouchableOpacity
							className="p-[10] flex-row items-center gap-2 justify-center"
							onPress={handleDeleteImport}
						>
							<TrashIcon
								color={getTailwindHexColor('red500')}
								width={20}
								height={20}
							/>
							<Text className="text-red500 text-lg font-bold">
								Delete Import
							</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity
						onPress={() => setImportActionsModalVisible(false)}
						className="bg-white rounded-lg p-[10] justify-center items-center"
					>
						<Text className="text-red500 text-lg font-bold">Cancel</Text>
					</TouchableOpacity>
				</View>
			</ModalComponent>
		</SafeAreaView>
	);
};

export default ImportDetailsScreen;

const styles = StyleSheet.create({
	image: {
		width: '80%',
		height: 300,
		borderRadius: 15,
	},
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
