import { ICreateUserRequest, IUser } from '@/api/auth/types';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Subtitle from '@/components/Subtitle';
import Text from '@/components/Text';
import { Formik } from 'formik';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import * as Yup from 'yup';

const userSchema = Yup.object({
	fullName: Yup.string().required('Full name is required'),
	location: Yup.string().optional(),
});

const EditProfileForm = ({ userInfo }: { userInfo: IUser }) => {
	const initialValues = {
		email: userInfo.email,
		fullName: userInfo.fullName,
		location: userInfo.location,
	};

	const handleSubmit = (values: ICreateUserRequest) => {
		console.log(values);
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

					<Button onPress={handleSubmit} text="Save" />
				</View>
			)}
		</Formik>
	);
};

export default EditProfileForm;
