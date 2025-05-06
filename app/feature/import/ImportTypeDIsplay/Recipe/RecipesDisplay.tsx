import { IRecipe } from '@/api/imports/types';
import { getDeviceWidth } from '@/utils/device';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import RecipeCard from './RecipeCard';

interface IProps {
	recipes: IRecipe[];
	handleItemPress: (item: any) => void;
}

const cardWidth = getDeviceWidth() - 40;

const RecipesDisplay = ({ recipes, handleItemPress }: IProps) => {
	return (
		<ScrollView
			horizontal
			showsVerticalScrollIndicator={false}
			showsHorizontalScrollIndicator={false}
			decelerationRate="fast"
			snapToInterval={cardWidth + 10}
			snapToAlignment="start"
			contentContainerStyle={{
				alignItems: 'flex-start',
				gap: 10,
			}}
		>
			{recipes.map((recipe) => (
				<RecipeCard
					key={recipe.id}
					recipe={recipe}
					width={cardWidth}
					onPress={() => handleItemPress(recipe)}
				/>
			))}
		</ScrollView>
	);
};

export default RecipesDisplay;
