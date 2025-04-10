import { IImport } from '@/api/imports/types';
import Text from '@/components/Text';
import { blurhash } from '@/shared/contants';
import { InstagramIcon, ThreeDotsIcon, TiktokIcon } from '@/shared/svgs';
import { getTailwindHexColor } from '@/utils/getTailwindColor';
import { ImageBackground } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import ImportTypeIcon from './ImportTypeIcon';

interface IProps {
	importItem: IImport;
	cardWidth: number;
}

const ImportCard = ({ importItem, cardWidth }: IProps) => {
	return (
		<View
			className="bg-gray-100 rounded-lg flex-col gap-3 overflow-hidden"
			style={{ width: cardWidth, height: 300 }}
		>
			{importItem.thumbnail ? (
				<ImageBackground
					source={{ uri: importItem.thumbnail }}
					style={styles.image}
					contentFit="cover"
					placeholder={blurhash}
					transition={500}
				>
					<View className="bg-gray-100 rounded-lg p-2 w-10 h-10 items-center justify-center border border-gray-200 absolute left-2 bottom-2">
						<ImportTypeIcon type={importItem.type} />
					</View>
					<View className="rounded-lg items-center justify-center absolute right-2 top-2">
						<ThreeDotsIcon
							height={22}
							width={22}
							color={getTailwindHexColor('white')}
							style={{
								transform: [{ rotate: '90deg' }],
							}}
						/>
					</View>
				</ImageBackground>
			) : (
				<View className="bg-gray200" style={styles.image}></View>
			)}
			<View className="flex-col px-3 gap-2">
				<Text className="heading-xxsmall" numberOfLines={2}>
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
		</View>
	);
};

export default ImportCard;

const styles = StyleSheet.create({
	image: {
		width: '100%',
		height: 200,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
});
