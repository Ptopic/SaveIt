import { countries } from '@/shared/countries';
import React, { Dispatch, SetStateAction } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { twMerge } from 'tailwind-merge';
import ModalCloseButton from './ModalCloseButton';
import ModalComponent from './ModalComponent';
import Text from './Text';

interface IProps {
	isSelectCountryModalVisible: boolean;
	setIsSelectCountryModalVisible: Dispatch<SetStateAction<boolean>>;
	selectedCountry: string;
	setSelectedCountry: Dispatch<SetStateAction<string>>;
}

const SelectCountryModal = ({
	isSelectCountryModalVisible,
	setIsSelectCountryModalVisible,
	selectedCountry,
	setSelectedCountry,
}: IProps) => {
	const handleSelectCountry = (country: any) => {
		setSelectedCountry(`${country.flag} ${country.name}`);
		setIsSelectCountryModalVisible(false);
	};

	const renderItem = ({ item: country }: { item: any }) => (
		<TouchableOpacity
			className={twMerge(
				'flex-row items-center justify-between p-2 rounded-lg',
				selectedCountry === `${country.flag} ${country.name}` && 'bg-gray200'
			)}
			key={country.name}
			onPress={() => handleSelectCountry(country)}
		>
			<Text>
				{country.flag} {country.name}
			</Text>
		</TouchableOpacity>
	);

	return (
		<ModalComponent
			modalVisible={isSelectCountryModalVisible}
			setModalVisible={setIsSelectCountryModalVisible}
			overlayStyle={styles.modalOverlay}
			modalStyle={styles.modalContainer}
		>
			<View className="flex-col gap-2">
				<ModalCloseButton
					closeModal={() => setIsSelectCountryModalVisible(false)}
				/>
				<FlatList
					data={countries}
					renderItem={renderItem}
					keyExtractor={(item) => item.name}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ gap: 6 }}
					removeClippedSubviews={false}
					initialNumToRender={20}
					maxToRenderPerBatch={20}
					windowSize={21}
					getItemLayout={(data, index) => ({
						length: 50,
						offset: 50 * index,
						index,
					})}
				/>
			</View>
		</ModalComponent>
	);
};

export default SelectCountryModal;

const styles = StyleSheet.create({
	modalOverlay: {
		justifyContent: 'flex-end',
	},
	modalContainer: {
		width: '100%',
		height: 400,
		paddingBottom: 40,
		paddingHorizontal: 10,
		backgroundColor: 'white',
	},
});
