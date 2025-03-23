import { goBack } from '@/utils/navigation';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ProfileScreen = () => {
	return (
		<View style={styles.container}>
			<Text>Profile</Text>
			<TouchableOpacity onPress={goBack}>
				<Text>Back</Text>
			</TouchableOpacity>
		</View>
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
