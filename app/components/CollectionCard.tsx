import { blurhash } from '@/shared/contants';
import { LockClosedIcon } from '@/shared/svgs';
import { ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
interface IProps {
	id: number;
	name: string;
	image: string;
}

const CollectionCard = ({ id, name, image }: IProps) => {
	return (
		<>
			{image ? (
				<Link
					href={`/collection/${id}`}
					className="w-[140px] h-[170px] rounded-lg bg-gray200"
				>
					<View className="w-full h-full overflow-hidden rounded-lg">
						<ImageBackground
							source={{ uri: image }}
							style={styles.image}
							contentFit="cover"
							placeholder={blurhash}
							transition={500}
						>
							<LinearGradient
								colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']}
								style={{
									position: 'absolute',
									bottom: 0,
									width: '100%',
									flexDirection: 'row',
									justifyContent: 'space-between',
									alignItems: 'center',
									paddingHorizontal: 10,
									paddingVertical: 5,
									borderBottomLeftRadius: 10,
									borderBottomRightRadius: 10,
								}}
							>
								<Text className="text-white font-[500] w-[80%]">{name}</Text>

								<LockClosedIcon color="white" width={20} height={20} />
							</LinearGradient>
						</ImageBackground>
					</View>
				</Link>
			) : (
				<Link href={`/collection/${id}`} className="w-[140] h-[170] rounded-lg">
					<View className="w-full h-full overflow-hidden rounded-lg">
						<LinearGradient
							colors={['#FC5C7D', '#6A82FB']} // Adjust the main gradient colors as needed
							locations={[0, 1]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={{
								width: '100%',
								height: '100%',
								borderRadius: 10,
								justifyContent: 'flex-end',
							}}
						>
							<LinearGradient
								colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.7)']} // Black gradient for text overlay
								locations={[0, 1]}
								style={{
									position: 'absolute',
									bottom: 0,
									width: '100%',
									flexDirection: 'row',
									justifyContent: 'space-between',
									alignItems: 'center',
									paddingHorizontal: 10,
									paddingVertical: 5,
									borderBottomLeftRadius: 10,
									borderBottomRightRadius: 10,
								}}
							>
								<Text className="text-white font-[500] w-[80%]">{name}</Text>
								<LockClosedIcon color="white" width={20} height={20} />
							</LinearGradient>
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
