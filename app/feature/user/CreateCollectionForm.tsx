import useCreateCollection from '@/api/collection/hooks/useCreateCollection';
import { COLLECTIONS } from '@/api/constants';
import Button from '@/components/Button';
import Input from '@/components/Input';
import ModalCloseButton from '@/components/ModalCloseButton';
import ModalComponent from '@/components/ModalComponent';
import Switch from '@/components/Switch';
import Text from '@/components/Text';
import { ImageIcon } from '@/shared/svgs';
import { getTailwindHexColor } from '@/utils/getTailwindColor';
import { useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import * as Yup from 'yup';

const collectionSchema = Yup.object({
	name: Yup.string().required('Name is required').max(30),
	description: Yup.string().required('Description is required').max(200),
});

const CreateCollectionForm = ({ closeModal }: { closeModal: () => void }) => {
	const toast = useToast();
	const queryClient = useQueryClient();
	const [modalVisible, setModalVisible] = useState(false);
	const [image, setImage] = useState<string | null>(null);
	const [imageBase64, setImageBase64] = useState<string | null>(null);
	const [isPublic, setIsPublic] = useState(false);

	const initialValues = { name: '', description: '' };

	const { mutate: createCollection, isPending: isCreatingCollection } =
		useCreateCollection();

	const handleSubmit = (values: any, { resetForm }: any) => {
		createCollection(
			{
				name: values.name,
				description: values.description ?? '',
				image: imageBase64 ?? '',
				isPublic,
			},
			{
				onSuccess: async () => {
					toast.show('Collection created successfully', { type: 'success' });
					await queryClient.invalidateQueries({ queryKey: [COLLECTIONS] });
					resetForm();
					setImage(null);
					setImageBase64(null);
					closeModal();
				},
				onError: () => {
					toast.show('Failed to create collection', { type: 'error' });
				},
			}
		);
	};

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			aspect: [16, 9],
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
			validationSchema={collectionSchema}
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
				<View className="gap-[20]">
					<ModalCloseButton
						closeModal={() => {
							closeModal();
							resetForm();
							setImage(null);
							setImageBase64(null);
						}}
					/>

					<View className="items-center justify-center">
						{image ? (
							<TouchableOpacity
								className="rounded-lg bg-gray200 w-[150] h-[180] justify-center items-center"
								onPress={() => setModalVisible(true)}
							>
								<Image
									source={{ uri: image }}
									className="rounded-lg w-[150] h-[180]"
								/>
							</TouchableOpacity>
						) : (
							<TouchableOpacity
								className="rounded-lg bg-gray200 w-[150] h-[180] justify-center items-center"
								onPress={pickImage}
							>
								<ImageIcon
									width={34}
									height={34}
									color={getTailwindHexColor('black')}
								/>
							</TouchableOpacity>
						)}
					</View>

					<View className="gap-2">
						<Input
							name="name"
							placeholder="Name"
							value={values.name}
							onChangeText={handleChange('name')}
							onBlur={handleBlur('name')}
							maxLength={30}
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
						<View className="flex-row items-center justify-between gap-2 my-2">
							<Text className="body-medium-regular">Make Public</Text>
							<Switch isPublic={isPublic} setIsPublic={setIsPublic} />
						</View>
						<Button
							onPress={() => {
								handleSubmit();
							}}
							text="Create"
							disabled={
								!values.name || !values.description || isCreatingCollection
							}
							isSubmitting={isCreatingCollection}
							submittingText="Creating..."
						/>
					</View>

					<ModalComponent
						modalVisible={modalVisible}
						setModalVisible={setModalVisible}
						overlayStyle={styles.modalOverlay}
						modalStyle={styles.modalContainer}
					>
						<View>
							<View className="flex-col mb-[10] rounded-lg bg-gray100">
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
								<View className="h-[1] bg-gray300"></View>
								<TouchableOpacity
									className="p-[10] justify-center items-center"
									onPress={() => {
										setImage(null);
										setImageBase64(null);
										setModalVisible(false);
									}}
								>
									<Text className="text-red500 text-lg font-bold">Remove</Text>
								</TouchableOpacity>
							</View>
							<TouchableOpacity
								onPress={() => setModalVisible(false)}
								className="bg-white rounded-lg p-[10] justify-center items-center"
							>
								<Text className="text-red500 text-lg font-bold">Cancel</Text>
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
