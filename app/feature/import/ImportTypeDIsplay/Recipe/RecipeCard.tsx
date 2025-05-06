import { IRecipe } from '@/api/imports/types';
import Text from '@/components/Text';
import { TouchableOpacity, View } from 'react-native';

interface IProps {
	recipe: IRecipe;
	width: number;
	onPress: () => void;
}

const RecipeCard = ({ recipe, width, onPress }: IProps) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={{ width }}
			className="justify-start h-[200px] bg-gray50 border border-gray200 rounded-lg p-4 flex flex-col gap-4"
			activeOpacity={1}
		>
			<Text className="heading-xsmall">{recipe.name}</Text>
			<View className="bg-gray300 w-full h-[1px]" />
			<Text className="body-small-regular" numberOfLines={2}>
				{recipe.description}
			</Text>
		</TouchableOpacity>
	);
};

export default RecipeCard;
