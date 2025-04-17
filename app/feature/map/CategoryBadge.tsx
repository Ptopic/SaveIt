import Text from '@/components/Text';
import { View } from 'react-native';

interface IProps {
	category: string;
}

const CategoryBadge = ({ category }: IProps) => {
	return (
		<View className="bg-gray50 border border-gray200 rounded-lg p-2">
			<Text>{category}</Text>
		</View>
	);
};

export default CategoryBadge;
