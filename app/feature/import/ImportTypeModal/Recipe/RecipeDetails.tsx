import { IRecipe } from '@/api/imports/types';
import RecipeDisplay from '@/components/ContentTypeDisplays/RecipeDisplay';
import Title from '@/components/Title';
import { CloseIcon } from '@/shared/svgs';
import { DisplayIngredient } from '@/types/recipe';
import { getTailwindHexColor } from '@/utils/getTailwindColor';
import React, { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

interface IProps {
	recipe: IRecipe;
	handleCloseModal: () => void;
	setIsExternalModalVisible?: Dispatch<SetStateAction<boolean>>;
	originalServes?: MutableRefObject<number>;
	serves?: number;
	setServes?: (serves: number) => void;
	displayIngredients?: DisplayIngredient[];
	setDisplayIngredients?: (displayIngredients: DisplayIngredient[]) => void;
}

const RecipeDetails = ({
	recipe,
	handleCloseModal,
	setIsExternalModalVisible,
	originalServes,
	serves,
	setServes,
	displayIngredients,
	setDisplayIngredients,
}: IProps) => {
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
						setIsExternalModalVisible && setIsExternalModalVisible(false);
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
				<RecipeDisplay
					data={recipeData}
					setIsExternalModalVisible={setIsExternalModalVisible}
					originalServes={originalServes}
					serves={serves}
					setServes={setServes}
					displayIngredients={displayIngredients}
					setDisplayIngredients={setDisplayIngredients}
				/>
			</ScrollView>
		</View>
	);
};

export default RecipeDetails;
