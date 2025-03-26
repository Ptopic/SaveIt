import useCreateCollection from '@/api/collection/hooks/useCreateCollection';
import { COLLECTIONS } from '@/api/constants';
import Input from '@/components/Input';
import ModalComponent from '@/components/ModalComponent';
import { CloseIcon, ImageIcon } from '@/shared/svgs';
import { useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
			description: values.description || undefined,
			image: imageBase64 || undefined,
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
			setImageBase64(`data:image/jpeg;base64,${result.assets[0].base64}`);
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
				<View className="gap-[20]">
					<TouchableOpacity
						className="bg-gray400 rounded-full w-[30] h-[30] justify-center items-center"
						onPress={() => {
							closeModal();
							resetForm();
							setImage(null);
							setImageBase64(null);
						}}
					>
						<CloseIcon width={20} height={20} color="white" />
					</TouchableOpacity>

					<View className="items-center justify-center">
						{image ? (
							<TouchableOpacity
								className="rounded-lg bg-gray400 w-[150] h-[180] justify-center items-center"
								onPress={() => setModalVisible(true)}
							>
								<Image
									source={{ uri: image }}
									className="rounded-lg w-[150] h-[180]"
								/>
							</TouchableOpacity>
						) : (
							<TouchableOpacity
								className="rounded-lg bg-gray400 w-[150] h-[180] justify-center items-center"
								onPress={pickImage}
							>
								<ImageIcon width={34} height={34} color="white" />
							</TouchableOpacity>
						)}
					</View>

					<View className="gap-[10]">
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
							className="bg-gray400 rounded-lg p-[10] justify-center items-center"
						>
							<Text className="text-white text-lg font-bold">Create</Text>
						</TouchableOpacity>
					</View>

					<ModalComponent
						modalVisible={modalVisible}
						setModalVisible={setModalVisible}
						overlayStyle={styles.modalOverlay}
						modalStyle={styles.modalContainer}
					>
						<View>
							<View className="flex-col mb-[10] rounded-lg bg-gray500">
								<TouchableOpacity
									className="p-[10] justify-center items-center"
									onPress={() => {
										pickImage();
									}}
								>
									<Text className="text-black text-lg font-bold">
										Chose new image
									</Text>
								</TouchableOpacity>
								<View className="h-[1] bg-gray600"></View>
								<TouchableOpacity
									className="p-[10] justify-center items-center"
									onPress={() => {
										setImage(null);
										setImageBase64(null);
										setModalVisible(false);
									}}
								>
									<Text className="text-red600 text-lg font-bold">Remove</Text>
								</TouchableOpacity>
							</View>
							<TouchableOpacity
								onPress={() => setModalVisible(false)}
								className="bg-white rounded-lg p-[10] justify-center items-center"
							>
								<Text className="text-red600 text-lg font-bold">Cancel</Text>
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
	modalOverlay: {
		justifyContent: 'flex-end',
	},
	modalContainer: {
		width: '100%',
		paddingBottom: 40,
		paddingHorizontal: 10,
		backgroundColor: 'transparent',
	},
});
