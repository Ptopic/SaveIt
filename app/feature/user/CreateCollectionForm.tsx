import useCreateCollection from '@/api/collection/hooks/useCreateCollection';
import { COLLECTIONS } from '@/api/constants';
import Input from '@/components/Input';
import ModalComponent from '@/components/ModalComponent';
import { useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Yup from 'yup';

const userSchema = Yup.object({
	name: Yup.string().required('Name is required').max(50),
	description: Yup.string().required('Description is required').max(200),
});

const CreateCollectionForm = ({ closeModal }: { closeModal: () => void }) => {
	const queryClient = useQueryClient();
	const [modalVisible, setModalVisible] = useState(false);
	const [image, setImage] = useState<string | null>(null);
	const [imageBase64, setImageBase64] = useState<string | null>(null);

	const initialValues = { name: '', description: '' };

	const { mutate: createCollection } = useCreateCollection({
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [COLLECTIONS] });
			closeModal();
		},
		onError: (error: Error) => {
			console.log(error);
		},
	});

	const handleSubmit = (values: any, { setSubmitting }: any) => {
		createCollection({
			name: values.name,
			description: values.description,
		});
		setSubmitting(false);
	};

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
			base64: true,
		});

		if (!result.canceled && result.assets?.[0]) {
			setImage(result.assets[0].uri ?? null);
			setImageBase64(result.assets[0].base64 ?? null);
			setModalVisible(false);
		}
	};

	return (
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
				isSubmitting,
			}) => (
				<View style={styles.createCollectionModalContainer}>
					<TouchableOpacity
						style={styles.closeButton}
						onPress={() => {
							closeModal();
							resetForm();
							setImage(null);
							setImageBase64(null);
						}}
					>
						<Icon name="close" size={20} color="white" />
					</TouchableOpacity>

					<View style={styles.addCollectionImagePlaceholderContainer}>
						{image ? (
							<TouchableOpacity
								style={styles.addCollectionImagePlaceholder}
								onPress={() => setModalVisible(true)}
							>
								<Image
									source={{ uri: image }}
									style={styles.addCollectionImage}
								/>
							</TouchableOpacity>
						) : (
							<TouchableOpacity
								style={styles.addCollectionImagePlaceholder}
								onPress={pickImage}
							>
								<Icon name="image" size={34} color="white" />
							</TouchableOpacity>
						)}
					</View>

					<View style={styles.formContainer}>
						<Input
							name="name"
							placeholder="Name"
							value={values.name}
							onChangeText={handleChange('name')}
							onBlur={handleBlur('name')}
							maxLength={50}
						/>
						{values.name && (
							<Input
								name="description"
								placeholder="Description"
								value={values.description}
								onChangeText={handleChange('description')}
								onBlur={handleBlur('description')}
								error={errors.description}
								maxLength={200}
							/>
						)}
						<TouchableOpacity
							onPress={() => {
								handleSubmit();
							}}
							disabled={!values.name || !values.description || isSubmitting}
							style={styles.submitButton}
						>
							<Text style={styles.submitButtonText}>Create</Text>
						</TouchableOpacity>
					</View>

					<ModalComponent
						modalVisible={modalVisible}
						setModalVisible={setModalVisible}
						overlayStyle={styles.modalOverlay}
						modalStyle={styles.modalContainer}
					>
						<View>
							<View style={styles.modalButtonsContainer}>
								<TouchableOpacity
									style={styles.modalButton}
									onPress={() => {
										pickImage();
									}}
								>
									<Text style={styles.modalButtonText}>Chose new</Text>
								</TouchableOpacity>
								<View style={styles.divider}></View>
								<TouchableOpacity
									style={styles.modalButton}
									onPress={() => {
										setImage(null);
										setImageBase64(null);
										setModalVisible(false);
									}}
								>
									<Text style={styles.modalButtonRemoveText}>Remove</Text>
								</TouchableOpacity>
							</View>
							<TouchableOpacity
								onPress={() => setModalVisible(false)}
								style={styles.modalCancelButton}
							>
								<Text style={styles.modalCancelButtonText}>Cancel</Text>
							</TouchableOpacity>
						</View>
					</ModalComponent>
				</View>
			)}
		</Formik>
	);
};

export default CreateCollectionForm;

const styles = StyleSheet.create({
	closeButton: {
		backgroundColor: 'lightgray',
		width: 30,
		height: 30,
		borderRadius: 15,
		justifyContent: 'center',
		alignItems: 'center',
	},
	createCollectionModalContainer: {
		gap: 20,
	},
	addCollectionImagePlaceholderContainer: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	addCollectionImagePlaceholder: {
		width: 150,
		height: 180,
		backgroundColor: 'lightgray',
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	addCollectionImage: {
		width: 150,
		height: 180,
		borderRadius: 10,
	},
	formContainer: {
		gap: 10,
	},
	errorText: {
		color: 'red',
	},
	submitButton: {
		backgroundColor: 'lightgray',
		borderRadius: 5,
		padding: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	divider: {
		height: 0.5,
		backgroundColor: '#B2B3B3',
	},
	submitButtonText: {
		color: 'white',
		fontSize: 16,
	},
	modalOverlay: {
		justifyContent: 'flex-end',
	},
	modalContainer: {
		width: '100%',
		paddingBottom: 40,
		paddingHorizontal: 10,
		backgroundColor: 'transparent',
	},
	modalButtonsContainer: {
		flexDirection: 'column',
		marginBottom: 10,
		borderRadius: 5,
		backgroundColor: '#D6D6D6FF',
	},
	modalButton: {
		padding: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalButtonText: {
		color: 'black',
		fontSize: 16,
	},
	modalButtonRemoveText: {
		color: 'red',
		fontSize: 16,
	},
	modalCancelButton: {
		backgroundColor: '#FFFEFE',
		padding: 10,
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalCancelButtonText: {
		color: 'red',
		fontSize: 16,
	},
});
