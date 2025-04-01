import { USER_INFO } from '@/api/constants';
import useUpdateUser from '@/api/user/hooks/useUpdateUser';
import { IUser } from '@/api/user/types';
import Button from '@/components/Button';
import Input from '@/components/Input';
import SelectCountryModal from '@/components/SelectCountryModal';
import Text from '@/components/Text';
import { useQueryClient } from '@tanstack/react-query';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import * as Yup from 'yup';

const userSchema = Yup.object({
	fullName: Yup.string().required('Full name is required'),
});

const EditProfileForm = ({ userInfo }: { userInfo: IUser }) => {
	const [isSelectCountryModalVisible, setIsSelectCountryModalVisible] =
		useState(false);

	const [selectedCountry, setSelectedCountry] = useState(userInfo.country);

	const toast = useToast();
	const queryClient = useQueryClient();

	const { mutate: updateUser, isPending } = useUpdateUser();

	const initialValues = {
		email: userInfo.email,
		fullName: userInfo.fullName,
		country: userInfo.country,
	};

	const handleSubmit = (values: any, { resetForm }: any) => {
		updateUser(
			{ fullName: values.fullName, country: selectedCountry },
			{
				onSuccess: () => {
					toast.show('Profile updated successfully', {
						type: 'success',
					});
					queryClient.invalidateQueries({
						queryKey: [USER_INFO],
					});
				},
			}
		);
	};
	return (
		<View>
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
					<View className="gap-4">
						<View className="gap-2">
							<Input
								name="email"
								placeholder="Email"
								value={values.email}
								onChangeText={handleChange('email')}
								onBlur={handleBlur('email')}
								disabled
								placeholderAlwaysVisible
							/>
							<Input
								name="fullName"
								placeholder="Full Name"
								value={values.fullName}
								onChangeText={handleChange('fullName')}
								onBlur={handleBlur('fullName')}
								error={errors.fullName as string}
								placeholderAlwaysVisible
							/>
							<View className="flex-col gap-2 w-full">
								<Text className="ml-[2] text-black">Country</Text>
								<TouchableOpacity
									className="border border-black w-full rounded-lg p-[10]"
									onPress={() => setIsSelectCountryModalVisible(true)}
								>
									{selectedCountry ? (
										<Text>{selectedCountry}</Text>
									) : (
										<Text>Select country</Text>
									)}
								</TouchableOpacity>
							</View>
						</View>

						<Button
							onPress={handleSubmit}
							text="Save"
							isSubmitting={isPending}
							submittingText="Saving..."
						/>
					</View>
				)}
			</Formik>
			<SelectCountryModal
				isSelectCountryModalVisible={isSelectCountryModalVisible}
				setIsSelectCountryModalVisible={setIsSelectCountryModalVisible}
				selectedCountry={selectedCountry}
				setSelectedCountry={setSelectedCountry}
			/>
		</View>
	);
};

export default EditProfileForm;
