import { IRecipe } from '@/api/imports/types';
import RecipeDisplay from '@/components/ContentTypeDisplays/RecipeDisplay';
import { CloseIcon } from '@/shared/svgs';
import { getTailwindHexColor } from '@/utils/getTailwindColor';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

interface IProps {
	recipe: IRecipe;
	handleCloseModal: () => void;
}

const RecipeDetails = ({ recipe, handleCloseModal }: IProps) => {
	const recipeData = {
		...recipe,
	};

	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<View className="flex-row justify-end items-center">
				<TouchableOpacity
					className="bg-red100 rounded-full w-[30] h-[30] justify-center items-center"
					onPress={() => {
						handleCloseModal();
					}}
				>
					<CloseIcon
						width={20}
						height={20}
						color={getTailwindHexColor('red400')}
					/>
				</TouchableOpacity>
			</View>
			<RecipeDisplay data={recipeData} />
			<View className="h-[20px]" />
		</ScrollView>
	);
};

export default RecipeDetails;
