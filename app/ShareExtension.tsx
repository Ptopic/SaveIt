// Share.js
import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { ShareMenuReactView } from 'react-native-share-menu';
import Svg, { Path } from 'react-native-svg';

const Share = () => {
	const [loading, setLoading] = useState(true);
	const [shareData, setShareData] = useState<any>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await ShareMenuReactView.data();
				if (result && result.data) {
					if (result.data.length > 0) {
						setTimeout(() => {
							ShareMenuReactView.continueInApp({
								url: (result.data as any)[0].data,
							});
						}, 2000);
					}
				} else {
					ShareMenuReactView.dismissExtension();
				}
			} catch (err) {
				console.log(err);
			}
		};

		fetchData();

		return () => {
			setLoading(true);
			setShareData(null);
		};
	}, []);

	const handleDismiss = () => {
		ShareMenuReactView.dismissExtension();
	};

	return (
		<ScrollView contentContainerStyle={styles.scrollViewContainer}>
			<TouchableOpacity
				style={styles.overlay}
				activeOpacity={1}
				onPress={handleDismiss}
			/>

			<TouchableOpacity
				style={styles.content}
				onPress={handleDismiss}
				activeOpacity={1}
			>
				<View style={styles.header}>
					<Svg
						fill="black"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="black"
						height={36}
						width={36}
						style={styles.logo}
					>
						<Path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
						/>
					</Svg>
					<Text style={styles.title}>Save It</Text>
				</View>

				<View style={styles.body}>
					{loading && (
						<View style={styles.bodyContent}>
							<Text style={styles.bodyTitle}>Importing...</Text>
							<ActivityIndicator size="small" color="black" />
						</View>
					)}
					<Text style={styles.bodyDescription}>Tap anywhere to dismiss</Text>
				</View>
			</TouchableOpacity>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	scrollViewContainer: {
		flex: 1,
		justifyContent: 'flex-end',
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
	},
	content: {
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: 'white',
		width: '100%',
		minHeight: 350,
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
		gap: 50,
		padding: 25,
		zIndex: 1,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'center',
		gap: 10,
		alignItems: 'center',
		marginBottom: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#333',
	},
	body: {
		flexDirection: 'column',
		gap: 10,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 20,
	},
	bodyContent: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		marginBottom: 10,
	},
	bodyTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#333',
	},
	errorTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: 'red',
	},
	errorText: {
		fontSize: 14,
		color: 'red',
		textAlign: 'center',
	},
	bodyDescription: {
		fontSize: 14,
		color: 'gray',
		textAlign: 'center',
	},
	// logo: {
	// 	width: 36,
	// 	height: 36,
	// 	transform: [{ rotate: '-25deg' }],
	// },
});

export default Share;
