import { IUser } from '@/api/auth/types';
import { USER_INFO } from '@/api/constants';
import useUpdateUser from '@/api/user/hooks/useUpdateUser';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Subtitle from '@/components/Subtitle';
import Text from '@/components/Text';
import { useQueryClient } from '@tanstack/react-query';
import { Formik } from 'formik';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import * as Yup from 'yup';

const userSchema = Yup.object({
	fullName: Yup.string().required('Full name is required'),
});

const EditProfileForm = ({ userInfo }: { userInfo: IUser }) => {
	const toast = useToast();
	const queryClient = useQueryClient();

	const { mutate: updateUser, isPending } = useUpdateUser();

	const initialValues = {
		email: userInfo.email,
		fullName: userInfo.fullName,
		location: userInfo.location,
	};

	const handleSubmit = (values: any, { resetForm }: any) => {
		updateUser(
			{ fullName: values.fullName, location: values.location },
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
						<TouchableOpacity className="flex-col gap-2 w-full">
							<Text>Location</Text>
							<TouchableOpacity className="border border-black w-full rounded-lg p-[10]">
								{values.location ? (
									<Text>{values.location}</Text>
								) : (
									<Text>Select location</Text>
								)}
							</TouchableOpacity>
						</TouchableOpacity>
					</View>

					<Subtitle>Extracts</Subtitle>

					<Button
						onPress={handleSubmit}
						text="Save"
						isSubmitting={isPending}
						submittingText="Saving..."
					/>
				</View>
			)}
		</Formik>
	);
};

export default EditProfileForm;
