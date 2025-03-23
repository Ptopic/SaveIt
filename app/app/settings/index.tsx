import { goBack } from '@/utils/navigation';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function SettingsScreen() {
	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Tab One</Text>
			<TouchableOpacity onPress={goBack}>
				<Text>Back</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
});
