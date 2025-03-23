import { goBack } from '@/utils/navigation';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = () => {
	return (
		<SafeAreaView style={styles.container}>
			<Text>Profile</Text>
			<TouchableOpacity onPress={goBack}>
				<Text>Back</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default ProfileScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
