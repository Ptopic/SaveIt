import Title from '@/components/Title';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

export default function TabOneScreen() {
	useEffect(() => {
		const getAccessToken = async () => {
			const accessToken = await AsyncStorage.getItem('accessToken');

			if (!accessToken) {
				router.navigate('/getStarted' as any);
			}
		};
		getAccessToken();
	}, []);

	return (
		<View style={styles.container}>
			<Title>Tab One</Title>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
