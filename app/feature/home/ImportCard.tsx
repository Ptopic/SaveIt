import { IImport } from '@/api/imports/types';
import SocialMediaIcon from '@/components/SocialMediaIcon';
import Text from '@/components/Text';
import { blurhash } from '@/shared/contants';
import { BookmarkIcon } from '@/shared/svgs';
import { getTailwindHexColor } from '@/utils/getTailwindColor';
import { ImageBackground } from 'expo-image';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ImportTypeOptions } from './FilterBadge/types';

interface IProps {
	importItem: IImport;
	cardWidth: number;
}

const ImportCard = ({ importItem, cardWidth }: IProps) => {
	let icon = null;

	if (importItem.type !== null) {
		icon = ImportTypeOptions[importItem.type].icon;
	}

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
								{icon}
							</View>
						</ImageBackground>
					) : (
						<View style={styles.image} className="bg-gray200">
							{icon && (
								<View className="bg-gray100 rounded-lg p-[6px] items-center justify-center border border-gray200 absolute left-2 bottom-2">
									{icon}
								</View>
							)}
						</View>
					)}
				</View>
				<View className="flex-col px-3 py-3 gap-2">
					{importItem.status === 'Importing' ? (
						<Text className="body-small-regular">Play importing animation</Text>
					) : (
						<Text className="heading-import-title" numberOfLines={2}>
							{importItem.title}
						</Text>
					)}
					{importItem.socialMediaType && (
						<SocialMediaIcon socialMediaType={importItem.socialMediaType} />
					)}
				</View>
			</Link>
			<TouchableOpacity
				className="rounded-lg bg-white border p-[6px] border-gray-200 items-center justify-center absolute z-20 right-2 top-2"
				activeOpacity={1}
			>
				<BookmarkIcon
					height={20}
					width={20}
					color={getTailwindHexColor('black')}
				/>
			</TouchableOpacity>
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
