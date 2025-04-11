import { IMPORTS } from '@/api/constants';
import useDeleteImport from '@/api/imports/hooks/useDeleteImport';
import useGetImport from '@/api/imports/hooks/useGetImport';
import ModalComponent from '@/components/ModalComponent';
import SocialMediaIcon from '@/components/SocialMediaIcon';
import Text from '@/components/Text';
import Title from '@/components/Title';
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
			queryClient.invalidateQueries({ queryKey: [IMPORTS] });
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
					<View className="flex items-center justify-center">
						<Image
							source={{ uri: importData.thumbnail }}
							style={styles.image}
							contentFit="cover"
							placeholder={blurhash}
							transition={500}
						/>
					</View>
					<Title>{importData.title}</Title>
					<View className="flex-row gap-2">
						{importData.url && (
							<Link
								href={importData.url}
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
					<ScrollView className="h-[40%]">
						<Text className="body-small-regular text-gray500">
							{JSON.stringify(importData.summary, null, 2)}
						</Text>
					</ScrollView>
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
