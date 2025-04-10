import useGetImport from '@/api/imports/hooks/useGetImport';
import Subtitle from '@/components/Subtitle';
import Text from '@/components/Text';
import { blurhash } from '@/shared/contants';
import { ArrowLeftIcon } from '@/shared/svgs';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
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
	const route = useRoute<ImportDetailsRouteProp>();
	const { id } = route.params;

	const { data: importData, isLoading } = useGetImport(id);

	return (
		<SafeAreaView className="flex-1 p-5 gap-2">
			<TouchableOpacity
				className="flex-row items-center gap-2"
				onPress={() => router.back()}
			>
				<ArrowLeftIcon height={24} width={24} />
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
					<Subtitle>{importData.title}</Subtitle>
					<ScrollView className="h-[40%]">
						<Text className="body-small-regular text-gray500">
							{JSON.stringify(importData.summary, null, 2)}
						</Text>
					</ScrollView>
				</View>
			)}
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
});
