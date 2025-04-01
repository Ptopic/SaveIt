import { CloseIcon, SearchIcon } from '@/shared/svgs';
import { TextInput, TouchableOpacity, View } from 'react-native';

interface IProps {
	value: string;
	onChangeText: (text: string) => void;
	placeholder: string;
}

const Search = ({ value, onChangeText, placeholder }: IProps) => {
	return (
		<View className="flex-row gap-2 bg-gray200 rounded-lg p-4">
			<SearchIcon color="black" width={20} height={20} />
			<TextInput
				autoComplete="off"
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
				placeholderTextColor="gray"
				className="flex-1"
			/>
			{value && (
				<TouchableOpacity onPress={() => onChangeText('')}>
					<CloseIcon color="black" width={20} height={20} />
				</TouchableOpacity>
			)}
		</View>
	);
};

export default Search;
