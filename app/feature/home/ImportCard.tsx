import { IImport } from '@/api/imports/types';
import Text from '@/components/Text';
import { blurhash } from '@/shared/contants';
import { BookmarkIcon, InstagramIcon, TiktokIcon } from '@/shared/svgs';
import { getTailwindHexColor } from '@/utils/getTailwindColor';
import { ImageBackground } from 'expo-image';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ImportTypeIcon from './ImportTypeIcon';

interface IProps {
	importItem: IImport;
	cardWidth: number;
}

const ImportCard = ({ importItem, cardWidth }: IProps) => {
	return (
		<View
			className="bg-gray-100 rounded-lg flex-col overflow-hidden relative z-10"
			style={{ width: cardWidth }}
		>
			<Link href={`/import/${importItem.id}`} className="flex-1">
				<View style={styles.imageContainer}>
					{importItem.thumbnail ? (
						<ImageBackground
							source={{ uri: importItem.thumbnail }}
							style={styles.image}
							contentFit="cover"
							placeholder={blurhash}
							transition={500}
						>
							<View className="bg-gray-100 rounded-lg p-[6px] items-center justify-center border border-gray-200 absolute left-2 bottom-2">
								<ImportTypeIcon type={importItem.type} />
							</View>
							<TouchableOpacity
								className="rounded-lg bg-gray-100 border p-[6px] border-gray-200 items-center justify-center absolute z-20 right-2 bottom-2"
								activeOpacity={1}
							>
								<BookmarkIcon
									height={20}
									width={20}
									color={getTailwindHexColor('black')}
								/>
							</TouchableOpacity>
						</ImageBackground>
					) : (
						<View style={styles.image} className="bg-gray200">
							<View className="bg-gray-100 rounded-lg p-[6px] items-center justify-center border border-gray-200 absolute left-2 bottom-2">
								<ImportTypeIcon type={importItem.type} />
							</View>
							<TouchableOpacity
								className="rounded-lg bg-gray-100 border p-[6px] border-gray-200 items-center justify-center absolute z-20 right-2 bottom-2"
								activeOpacity={1}
							>
								<BookmarkIcon
									height={20}
									width={20}
									color={getTailwindHexColor('black')}
								/>
							</TouchableOpacity>
						</View>
					)}
				</View>
				<View className="flex-col px-3 py-3 gap-2">
					<Text className="heading-import-title" numberOfLines={2}>
						{importItem.title}
					</Text>
					{importItem.socialMediaType === 'tiktok' && (
						<View className="flex-row gap-1 items-center">
							<TiktokIcon
								width={14}
								height={14}
								color={getTailwindHexColor('gray500')}
							/>
							<Text className="body-small-regular text-gray500">Tiktok</Text>
						</View>
					)}
					{importItem.socialMediaType === 'instagram' && (
						<View className="flex-row gap-2 items-center">
							<InstagramIcon
								width={14}
								height={14}
								color={getTailwindHexColor('gray500')}
							/>
							<Text className="body-small-regular text-gray500">Instagram</Text>
						</View>
					)}
				</View>
			</Link>
		</View>
	);
};

export default ImportCard;

const styles = StyleSheet.create({
	imageContainer: {
		width: '100%',
		height: 200,
	},
	image: {
		width: '100%',
		height: '100%',
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
});
