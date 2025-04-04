import useUpdateCollection from '@/api/collection/hooks/useUpdateCollection';
import { ICollection } from '@/api/collection/types';
import { COLLECTIONS } from '@/api/constants';
import Button from '@/components/Button';
import Input from '@/components/Input';
import ModalCloseButton from '@/components/ModalCloseButton';
import ModalComponent from '@/components/ModalComponent';
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

interface IProps {
	closeModal: () => void;
	collection: ICollection;
}

const collectionSchema = Yup.object({
	name: Yup.string().required('Name is required').max(30),
	description: Yup.string().required('Description is required').max(200),
});

const EditCollectionForm = ({ closeModal, collection }: IProps) => {
	const toast = useToast();
	const queryClient = useQueryClient();
	const [modalVisible, setModalVisible] = useState(false);
	const [image, setImage] = useState<string | null>(collection.image);
	const [imageBase64, setImageBase64] = useState<string | null>(null);

	const initialValues = {
		name: collection.name,
		description: collection.description,
	};

	const { mutate: editCollection, isPending: isEditingCollection } =
		useUpdateCollection(collection.id);

	const handleSubmit = (values: any) => {
		editCollection(
			{
				name: values.name,
				description: values.description ?? '',
				oldImage: image ?? null,
				newImage: imageBase64 ?? null,
			},
			{
				onSuccess: async () => {
					toast.show('Collection updated successfully', { type: 'success' });
					await queryClient.invalidateQueries({ queryKey: [COLLECTIONS] });
					setImageBase64(null);
					closeModal();
				},
				onError: () => {
					toast.show('Failed to create collection', { type: 'error' });
					setImage(collection.image ?? null);
					setImageBase64(null);
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
						}}
					/>

					<View className="items-center justify-center">
						{image ? (
							<TouchableOpacity
								className="rounded-lg bg-gray200 w-[200] h-[240] justify-center items-center"
								onPress={() => setModalVisible(true)}
							>
								<Image
									source={{ uri: image }}
									className="rounded-lg w-[200] h-[240]"
								/>
							</TouchableOpacity>
						) : (
							<TouchableOpacity
								className="rounded-lg bg-gray200 w-[200] h-[240] justify-center items-center"
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
						<Button
							onPress={() => {
								handleSubmit();
							}}
							text="Edit"
							disabled={
								!values.name || !values.description || isEditingCollection
							}
							isSubmitting={isEditingCollection}
							submittingText="Editing..."
						/>
					</View>

					<ModalComponent
						modalVisible={modalVisible}
						setModalVisible={setModalVisible}
						overlayStyle={styles.modalOverlay}
						modalStyle={styles.modalContainer}
					>
						<View>
							<View className="flex-col mb-[10] rounded-lg bg-gray200">
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

export default EditCollectionForm;

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
