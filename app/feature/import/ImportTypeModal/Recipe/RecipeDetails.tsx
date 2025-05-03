import { IRecipe } from '@/api/imports/types';
import RecipeDisplay from '@/components/ContentTypeDisplays/RecipeDisplay';
import Title from '@/components/Title';
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
		<View className="flex-1 bg-white">
			<View className="flex-row justify-between items-center pb-4 gap-2 bg-white">
				<Title>{recipeData.name}</Title>
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
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 24 }}
			>
				<RecipeDisplay data={recipeData} />
			</ScrollView>
		</View>
	);
};

export default RecipeDetails;
