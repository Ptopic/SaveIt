import Input from '@/components/Input';
import { Link } from 'expo-router';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity } from 'react-native';

const index = () => {
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Text>Login</Text>
			<Input
				placeholder="Email"
				name="email"
				value=""
				onChangeText={() => {}}
				onBlur={() => {}}
			/>
			<Input
				placeholder="Password"
				name="password"
				value=""
				onChangeText={() => {}}
				onBlur={() => {}}
			/>
			<TouchableOpacity onPress={() => {}}>
				<Text>Login</Text>
			</TouchableOpacity>

			<Link href={'/register' as any} asChild>
				<Text>Dont have an account? Sign up</Text>
			</Link>
		</SafeAreaView>
	);
};

export default index;
