import { IRecipeStep } from '@/api/imports/types';
import { CloseIcon, ListIcon } from '@/shared/svgs';
import { DisplayIngredient } from '@/types/recipe';
import { getTailwindHexColor } from '@/utils/getTailwindColor';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Pressable, View } from 'react-native';
import CustomBottomSheet from '../CustomBottomSheet';
import Text from '../Text';
import Title from '../Title';
import RecipeStepsIngredientsDisplay from './RecipeStepsIngredientsDisplay';
import { renderStepIngredients } from './utils';

interface IProps {
	steps: IRecipeStep[];
	setIsStepsGuideModalVisible: Dispatch<SetStateAction<boolean>>;
	displayIngredients: DisplayIngredient[];
	originalServes: number;
	serves: number;
	setServes: Dispatch<SetStateAction<number>>;
}

const RecipeStepsGuideDisplay = ({
	steps,
	setIsStepsGuideModalVisible,
	displayIngredients,
	originalServes,
	serves,
	setServes,
}: IProps) => {
	const [isIngredientsBottomSheetVisible, setIsIngredientsBottomSheetVisible] =
		useState(false);

	const [currentStep, setCurrentStep] = useState(0);

	return (
		<View className="flex-1 flex-col justify-between">
			<View className="flex-row items-center justify-end px-4">
				<Pressable
					onPress={() => setIsStepsGuideModalVisible(false)}
					className="bg-red100 rounded-full w-[30] h-[30] justify-center items-center"
				>
					<CloseIcon
						width={20}
						height={20}
						color={getTailwindHexColor('red400')}
					/>
				</Pressable>
			</View>
			<View className="flex-1 p-4 flex-col gap-6">
				<View className="flex-row gap-1">
					{steps.map((_, index) => (
						<View
							key={index}
							className={`flex-1 h-1 rounded-full ${
								index <= currentStep ? 'bg-orange400' : 'bg-gray-300'
							}`}
						/>
					))}
				</View>
				<View className="flex-row items-end gap-2">
					<Title>Step {currentStep + 1}</Title>
					<Text className="body-large-regular text-gray400">
						of {steps.length}
					</Text>
				</View>
				<View className="flex-1">
					{steps[currentStep]?.step ? (
						renderStepIngredients(
							steps[currentStep].step,
							displayIngredients,
							true
						)
					) : (
						<Text>Step description not available.</Text>
					)}
				</View>
			</View>
			<View className="p-4 flex-row gap-2">
				<Pressable
					className="p-2 h-12 w-12 flex-row items-center justify-center rounded-md bg-orange100"
					onPress={() => setIsIngredientsBottomSheetVisible(true)}
				>
					<ListIcon height={18} width={18} />
				</Pressable>
				<View className="flex-1 flex-row items-center gap-2">
					{currentStep > 0 && (
						<Pressable
							className="p-2 h-12 flex-1 flex-row items-center justify-center rounded-md bg-orange400"
							onPress={() => setCurrentStep(currentStep - 1)}
						>
							<Text className="text-white font-bold">Previous</Text>
						</Pressable>
					)}
					{currentStep < steps.length - 1 && (
						<Pressable
							className="p-2 h-12 flex-1 flex-row items-center justify-center rounded-md bg-orange400"
							onPress={() => setCurrentStep(currentStep + 1)}
						>
							<Text className="text-white font-bold">Next</Text>
						</Pressable>
					)}
					{currentStep === steps.length - 1 && (
						<Pressable
							className="p-2 h-12 flex-1 flex-row items-center justify-center rounded-md bg-orange400"
							onPress={() => setIsStepsGuideModalVisible(false)}
						>
							<Text className="text-white font-bold">Finish</Text>
						</Pressable>
					)}
				</View>
			</View>
			<CustomBottomSheet
				isVisible={isIngredientsBottomSheetVisible}
				setIsVisible={setIsIngredientsBottomSheetVisible}
				customAnimatedOverlayStyle={{
					backgroundColor: 'rgba(0, 0, 0, 0.4)',
				}}
				snapPoints={['40%', '90%']}
			>
				<RecipeStepsIngredientsDisplay
					displayIngredients={displayIngredients}
					originalServes={originalServes}
					serves={serves}
					setServes={setServes}
				/>
			</CustomBottomSheet>
		</View>
	);
};

export default RecipeStepsGuideDisplay;
