import { IRecipe } from '@/api/imports/types';
import { getTailwindHexColor } from '@/utils/getTailwindColor';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { DonutChart } from 'react-native-circular-chart';
import Subtitle from '../Subtitle';
import Text from '../Text';
import Title from '../Title';
import { renderStepIngredients } from './utils';

interface IProps {
	data: IRecipe;
}

const RecipeDisplay = ({ data }: IProps) => {
	const [strikedThroughIngredients, setStrikedThroughIngredients] = useState<
		string[]
	>([]);

	const handleIngredientPress = (ingredient: any) => {
		if (strikedThroughIngredients.includes(ingredient.ingredient)) {
			setStrikedThroughIngredients((prev) =>
				prev.filter((i) => i !== ingredient.ingredient)
			);
		} else {
			setStrikedThroughIngredients((prev) => [...prev, ingredient.ingredient]);
		}
	};

	return (
		<View className="flex-1 flex-col gap-2">
			<Title>{data.name}</Title>
			{data.description && (
				<Text className="text-gray500">{data.description}</Text>
			)}
			{data.type && <Text>{data.type}</Text>}
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ gap: 10 }}
			>
				{data.origin && (
					<View className="flex-row items-center rounded-md bg-gray100 p-2">
						<Text>Origin: </Text>
						<Text className="text-gray500">{data.origin}</Text>
					</View>
				)}
				{data.time && (
					<View className="flex-row items-center rounded-md bg-gray100 p-2">
						<Text>Time: </Text>
						<Text className="text-gray500">{data.time}</Text>
					</View>
				)}
				{data.difficulty && (
					<View className="flex-row items-center rounded-md bg-gray100 p-2">
						<Text>Difficulty: </Text>
						<Text className="text-gray500">{data.difficulty}</Text>
					</View>
				)}
				{data.spiceLevel && (
					<View className="flex-row items-center rounded-md bg-gray100 p-2">
						<Text>Spice Level: </Text>
						<Text className="text-gray500">{data.spiceLevel}</Text>
					</View>
				)}
				{data.diet && (
					<View className="flex-row items-center rounded-md bg-gray100 p-2">
						<Text>Diet: </Text>
						<Text className="text-gray500">{data.diet}</Text>
					</View>
				)}
			</ScrollView>
			{data.highlights && data.highlights.length > 0 && (
				<View>
					{data.highlights.map((highlight: any, index: any) => (
						<Text key={`highlight-${index}`}>{highlight?.highlight}</Text>
					))}
				</View>
			)}

			{data.tips && data.tips.length > 0 && (
				<>
					<Subtitle>Tips</Subtitle>
					<View>
						{data.tips.map((tip: any, index: any) => (
							<Text key={`tip-${index}`}>{tip?.tip}</Text>
						))}
					</View>
				</>
			)}

			{data.serves && (
				<View className="flex-row items-center">
					<Text>{data.serves + ' '}</Text>
					<Text>serves</Text>
				</View>
			)}

			{data.ingredients && data.ingredients.length > 0 && (
				<>
					<Subtitle>Ingredients</Subtitle>
					<View className="flex-col gap-2 justify-start">
						{data.ingredients.map((ingredient: any, index: any) => (
							<Pressable
								className="flex-row gap-2 flex-1 items-center justify-start p-2 bg-gray100 rounded-md w-fit"
								key={`ingredient-${index}-${ingredient?.ingredient}`}
								onPress={() => handleIngredientPress(ingredient)}
								style={{
									opacity: strikedThroughIngredients.includes(
										ingredient.ingredient
									)
										? 0.4
										: 1,
								}}
							>
								{ingredient?.emoji && <Text>{ingredient.emoji}</Text>}
								{ingredient?.quantity && (
									<Text className="font-bold">{ingredient.quantity}</Text>
								)}
								{ingredient?.ingredient && <Text>{ingredient.ingredient}</Text>}
							</Pressable>
						))}
					</View>
				</>
			)}

			{data.steps && data.steps.length > 0 && (
				<>
					<Subtitle>Steps</Subtitle>
					<View className="flex-col gap-2 justify-start">
						{data.steps.map((step: any, index: any) => (
							<View
								className="flex-row gap-2 items-start justify-start p-2 bg-gray100 rounded-md"
								key={`step-${index}-${step?.step?.substring(0, 10)}`}
							>
								{step?.emoji && <Text className="mt-0.5">{step.emoji}</Text>}
								{step?.step &&
									renderStepIngredients(step.step, data.ingredients)}
							</View>
						))}
					</View>
				</>
			)}

			{data.creatorInsights && data.creatorInsights.length > 0 && (
				<View className="flex-col gap-2">
					<Subtitle>Creator Insights</Subtitle>
					<View>
						{data.creatorInsights.map((insight: any, index: any) => (
							<Text key={`insight-${index}`}>{insight?.insight}</Text>
						))}
					</View>
				</View>
			)}

			{data.servingSuggestions && data.servingSuggestions.length > 0 && (
				<View className="flex-col gap-2">
					<Subtitle>Serving Suggestions</Subtitle>
					<View className="flex-col gap-2 justify-start">
						{data.servingSuggestions.map((serving: any, index: any) => {
							return (
								<View key={`serving-${index}`}>
									<Text>{serving?.servingSuggestion}</Text>
								</View>
							);
						})}
					</View>
				</View>
			)}

			{data.substitutions && data.substitutions.length > 0 && (
				<View className="flex-col gap-2">
					<Subtitle>Substitutions</Subtitle>
					<View>
						{data.substitutions.map((substitution: any, index: any) => (
							<Text key={`substitution-${index}`}>
								{substitution?.substitution}
							</Text>
						))}
					</View>
				</View>
			)}

			{data.equipment && data.equipment.length > 0 && (
				<View className="flex-col gap-2">
					<Subtitle>Equipment</Subtitle>
					<View>
						{data.equipment.map((equipment: any, index: any) => (
							<Text key={`equipment-${index}`}>{equipment?.equipment}</Text>
						))}
					</View>
				</View>
			)}

			{data.storage && data.storage.length > 0 && (
				<View className="flex-col gap-2">
					<Subtitle>Storage</Subtitle>
					<View>
						{data.storage.map((storage: any, index: any) => (
							<Text key={`storage-${index}`}>{storage?.storage}</Text>
						))}
					</View>
				</View>
			)}

			{data.didYouKnow && data.didYouKnow.length > 0 && (
				<View className="flex-col gap-2">
					<Subtitle>Did You Know?</Subtitle>
					<View>
						{data.didYouKnow.map((didYouKnow: any, index: any) => (
							<Text key={`didYouKnow-${index}`}>{didYouKnow?.didYouKnow}</Text>
						))}
					</View>
				</View>
			)}

			{(data.protein || data.carbohydrates || data.fat || data.calories) && (
				<>
					<Subtitle>Nutrition Facts</Subtitle>
					<View className="flex-row justify-between px-4 bg-gray100 p-2 rounded-md">
						<View className="relative">
							<View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
								<Text className="heading-xsmall text-center">Calories</Text>
								<Text className="text-center">~{data.calories}kcal</Text>
							</View>
							<DonutChart
								data={[
									{
										value: data.protein,
										color: getTailwindHexColor('red300'),
										name: 'Protein',
									},
									{
										value: data.carbohydrates,
										color: getTailwindHexColor('yellow400'),
										name: 'Carbohydrates',
									},
									{
										value: data.fat,
										color: getTailwindHexColor('blue400'),
										name: 'Fat',
									},
								]}
								strokeWidth={15}
								radius={65}
								containerWidth={150}
								containerHeight={150}
								type="round"
								startAngle={0}
								endAngle={360}
								animationType="slide"
								labelValueStyle={{
									display: 'none',
								}}
								labelTitleStyle={{
									display: 'none',
								}}
							/>
						</View>
						<View className="flex-col gap-2 p-2 rounded-md">
							{data.protein && <Text>Protein: {data.protein}g</Text>}
							{data.carbohydrates && (
								<Text>Carbohydrates: {data.carbohydrates}g</Text>
							)}
							{data.fat && <Text>Fat: {data.fat}g</Text>}
						</View>
					</View>
				</>
			)}
		</View>
	);
};

export default RecipeDisplay;
