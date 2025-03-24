import useSignIn from '@/api/auth/hooks/useSignIn';
import useSignUp from '@/api/auth/hooks/useSignUp';
import Input from '@/components/Input';
import LinkComponent from '@/components/LinkComponent';
import ModalComponent from '@/components/ModalComponent';
import Title from '@/components/Title';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Formik } from 'formik';
import React, { useState } from 'react';
import {
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import * as Yup from 'yup';

const userSchema = Yup.object({
	email: Yup.string().email('Invalid email'),
	password: Yup.string(),
});

const index = () => {
	const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
	const [modalVisible, setModalVisible] = useState(false);
	const initialValues = { email: '', password: '' };
	const { mutate: signin, isPending: isSigningIn } = useSignIn({
		onSuccess: async (data: any) => {
			await AsyncStorage.setItem('accessToken', data.token);
			setModalVisible(false);
			router.push('/');
		},
		onError: (error: Error) => {
			console.log(error);
		},
	});
	const { mutate: signup, isPending: isSigningUp } = useSignUp({
		onSuccess: async (data: any) => {
			await AsyncStorage.setItem('accessToken', data.token);
			setModalVisible(false);
			router.push('/');
		},
		onError: (error: Error) => {
			console.log(error);
		},
	});
	const handleSubmit = (values: any, { setSubmitting }: any) => {
		try {
			if (authMode === 'signin') {
				signin(values);
			} else {
				signup(values);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.videoContainer}>
				<Text style={styles.videoText}>Video</Text>
			</View>
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.button}
					onPress={() => setModalVisible(true)}
				>
					<Text style={styles.buttonText}>Get Started</Text>
				</TouchableOpacity>
			</View>

			<ModalComponent
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
				overlayStyle={styles.modalOverlay}
				modalStyle={styles.modalContainer}
			>
				<Formik
					initialValues={initialValues}
					validationSchema={userSchema}
					onSubmit={handleSubmit}
				>
					{({
						values,
						handleChange,
						handleBlur,
						handleSubmit,
						errors,
						resetForm,
					}) => (
						<View style={styles.modalContent}>
							<Title>
								{authMode === 'signin' ? 'Sign in' : 'Sign up'} to continue
							</Title>
							<View style={styles.inputContainer}>
								<Input
									name="email"
									placeholder="Email"
									value={values.email}
									onChangeText={handleChange('email')}
									onBlur={handleBlur('email')}
									error={errors.email}
								/>
								<Input
									name="password"
									placeholder="Password"
									type="password"
									value={values.password}
									onChangeText={handleChange('password')}
									onBlur={handleBlur('password')}
								/>
							</View>
							<TouchableOpacity
								style={styles.button}
								onPress={() => handleSubmit()}
							>
								<Text style={styles.buttonText}>
									{authMode === 'signin' ? 'Sign in' : 'Sign up'}
								</Text>
							</TouchableOpacity>
							{authMode === 'signin' ? (
								<LinkComponent onPress={() => setAuthMode('signup')}>
									Dont have an account? Sign up
								</LinkComponent>
							) : (
								<LinkComponent onPress={() => setAuthMode('signin')}>
									Already have an account? Sign in
								</LinkComponent>
							)}
						</View>
					)}
				</Formik>
			</ModalComponent>
		</SafeAreaView>
	);
};

export default index;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		gap: 20,
	},
	videoContainer: {
		flex: 1,
		backgroundColor: 'lightgray',
		justifyContent: 'center',
		alignItems: 'center',
	},
	videoText: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	buttonContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 15,
	},
	button: {
		width: '100%',
		height: 50,
		backgroundColor: 'black',
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	modalOverlay: {
		justifyContent: 'flex-end',
	},
	modalContainer: {
		width: '100%',
		borderRadius: 10,
		height: '100%',
		padding: 20,
	},
	modalContent: {
		alignItems: 'flex-start',
		gap: 20,
		width: '100%',
		paddingBottom: 40,
	},
	inputContainer: {
		gap: 10,
		width: '100%',
	},
});
