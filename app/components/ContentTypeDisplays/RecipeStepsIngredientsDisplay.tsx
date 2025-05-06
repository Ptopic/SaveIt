import { MinusIcon, PlusIcon } from '@/shared/svgs';
import { DisplayIngredient } from '@/types/recipe';
import { Dispatch, SetStateAction } from 'react';
import { Pressable, View } from 'react-native';
import Subtitle from '../Subtitle';
import Text from '../Text';

interface IProps {
	displayIngredients: DisplayIngredient[];
	originalServes: number;
	serves: number;
	setServes: Dispatch<SetStateAction<number>>;
}

const RecipeStepsIngredientsDisplay = ({
	displayIngredients,
	originalServes,
	serves,
	setServes,
}: IProps) => {
	return (
		<View className="flex-1">
			<View className="flex-col gap-2">
				<Subtitle>Ingredients</Subtitle>
				{setServes && originalServes && (
					<View className="flex-row items-center gap-2">
						<Pressable
							className="flex-row items-center justify-center size-6 bg-orange400 rounded-full p-2"
							onPress={() => setServes && setServes(Math.max(1, serves - 1))}
							disabled={!setServes || serves <= 1}
							style={{ opacity: !setServes || serves <= 1 ? 0.5 : 1 }}
						>
							<MinusIcon width={12} height={12} color="white" />
						</Pressable>
						<View className="flex-row items-center">
							<Text>{serves} serves</Text>
						</View>
						<Pressable
							className="flex-row items-center justify-center size-6 bg-orange400 rounded-full p-2"
							onPress={() => setServes && setServes(serves + 1)}
							disabled={!setServes}
							style={{ opacity: !setServes ? 0.5 : 1 }}
						>
							<PlusIcon width={12} height={12} color="white" />
						</Pressable>
					</View>
				)}
				<View className="flex-col gap-2 justify-start">
					{displayIngredients.map((ingredient, index) => (
						<Pressable
							className="flex-row gap-2 flex-1 items-center justify-start p-2 bg-gray100 rounded-md w-fit"
							key={`ingredient-${index}-${ingredient?.ingredient}`}
						>
							{ingredient?.emoji && <Text>{ingredient.emoji}</Text>}
							{ingredient?.displayQuantity && (
								<Text className="font-bold">{ingredient.displayQuantity}</Text>
							)}
							{ingredient?.ingredient && (
								<Text className="flex-1">{ingredient.ingredient}</Text>
							)}
						</Pressable>
					))}
				</View>
			</View>
		</View>
	);
};

export default RecipeStepsIngredientsDisplay;
