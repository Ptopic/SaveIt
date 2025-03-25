import { goBack } from '@/utils/navigation';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = () => {
	return (
		<SafeAreaView className="flex-1 items-center justify-center">
			<Text>Profile</Text>
			<TouchableOpacity onPress={goBack}>
				<Text>Back</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default ProfileScreen;
