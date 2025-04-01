import { blurhash } from '@/shared/contants';
import { LockClosedIcon } from '@/shared/svgs';
import { ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from './Text';

interface IProps {
	id: number;
	name: string;
	image: string;
	width?: number;
	height?: number;
	hideOverlay?: boolean;
}

const CollectionCard = ({
	id,
	name,
	image,
	width,
	height,
	hideOverlay,
}: IProps) => {
	return (
		<>
			{image ? (
				<Link
					href={`/collection/${id}`}
					style={{
						width: width ? width : 140,
						height: height ? height : 170,
					}}
					className={`rounded-lg bg-gray200`}
				>
					<View className="w-full h-full overflow-hidden rounded-lg">
						<ImageBackground
							source={{ uri: image }}
							style={styles.image}
							contentFit="cover"
							placeholder={blurhash}
							transition={500}
						>
							{!hideOverlay && (
								<LinearGradient
									colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']}
									style={{
										position: 'absolute',
										bottom: 0,
										width: '100%',
										flexDirection: 'row',
										justifyContent: 'space-between',
										alignItems: 'flex-end',
										paddingHorizontal: 10,
										paddingVertical: 10,
										borderBottomLeftRadius: 8,
										borderBottomRightRadius: 8,
									}}
								>
									<Text className="text-white font-[500] w-[80%]">{name}</Text>

									<LockClosedIcon color="white" width={20} height={20} />
								</LinearGradient>
							)}
						</ImageBackground>
					</View>
				</Link>
			) : (
				<Link
					href={`/collection/${id}`}
					style={{
						width: width ? width : 140,
						height: height ? height : 170,
					}}
					className={`rounded-lg bg-gray200`}
				>
					<View className="w-full h-full overflow-hidden rounded-lg">
						<LinearGradient
							colors={['#FC5C7D', '#6A82FB']}
							locations={[0, 1]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={{
								width: '100%',
								height: '100%',
								borderRadius: 8,
								justifyContent: 'flex-end',
								alignItems: 'flex-end',
							}}
						>
							{!hideOverlay && (
								<LinearGradient
									colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.7)']}
									locations={[0, 1]}
									style={{
										position: 'absolute',
										bottom: 0,
										width: '100%',
										flexDirection: 'row',
										justifyContent: 'space-between',
										alignItems: 'flex-end',
										paddingHorizontal: 10,
										paddingVertical: 10,
										borderBottomLeftRadius: 8,
										borderBottomRightRadius: 8,
									}}
								>
									<Text className="text-white font-[500] w-[80%]">{name}</Text>
									<LockClosedIcon color="white" width={20} height={20} />
								</LinearGradient>
							)}
						</LinearGradient>
					</View>
				</Link>
			)}
		</>
	);
};

export default CollectionCard;

const styles = StyleSheet.create({
	image: {
		width: '100%',
		height: '100%',
	},
});
