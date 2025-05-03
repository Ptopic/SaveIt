import { IRecipe } from '@/api/imports/types';
import {
	formatQuantityWithUnit,
	parseQuantityString,
} from '@/feature/import/quantityUtils';
import {
	CarbsIcon,
	FatIcon,
	MinusIcon,
	PlusIcon,
	ProteinIcon,
} from '@/shared/svgs';
import { getTailwindHexColor } from '@/utils/getTailwindColor';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { DonutChart } from 'react-native-circular-chart';
import Subtitle from '../Subtitle';
import Text from '../Text';
import { renderStepIngredients } from './utils';

interface DisplayIngredient {
	emoji?: string;
	quantity: string;
	ingredient: string;
	displayQuantity: string;
	originalNumericQuantity: number | null;
}

interface IProps {
	data: IRecipe;
}

const RecipeDisplay = ({ data }: IProps) => {
	const [strikedThroughIngredients, setStrikedThroughIngredients] = useState<
		string[]
	>([]);

	const originalServes = useRef(data.serves || 1);
	const [serves, setServes] = useState(data.serves || 1);

	const originalCalories = useRef(data.calories || 0);
	const originalProtein = useRef(data.protein || 0);
	const originalCarbs = useRef(data.carbohydrates || 0);
	const originalFat = useRef(data.fat || 0);

	const [displayCalories, setDisplayCalories] = useState(data.calories || 0);
	const [displayProtein, setDisplayProtein] = useState(data.protein || 0);
	const [displayCarbs, setDisplayCarbs] = useState(data.carbohydrates || 0);
	const [displayFat, setDisplayFat] = useState(data.fat || 0);

	const [displayIngredients, setDisplayIngredients] = useState<
		DisplayIngredient[]
	>([]);

	useEffect(() => {
		if (!data.ingredients?.length) return;

		const initialIngredients = data.ingredients.map((ing) => {
			const numericQuantity = parseQuantityString(ing.quantity);

			return {
				...ing,
				displayQuantity: ing.quantity,
				originalNumericQuantity: numericQuantity,
			};
		});

		setDisplayIngredients(initialIngredients);

		setServes(data.serves || 1);
		originalServes.current = data.serves || 1;

		const currentCalories = data.calories || 0;
		const currentProtein = data.protein || 0;
		const currentCarbs = data.carbohydrates || 0;
		const currentFat = data.fat || 0;

		setDisplayCalories(currentCalories);
		setDisplayProtein(currentProtein);
		setDisplayCarbs(currentCarbs);
		setDisplayFat(currentFat);

		originalCalories.current = currentCalories;
		originalProtein.current = currentProtein;
		originalCarbs.current = currentCarbs;
		originalFat.current = currentFat;
	}, [data]);

	useEffect(() => {
		const scaleFactor = serves / originalServes.current;

		if (displayIngredients.length > 0) {
			const updatedIngredients = displayIngredients.map((ing) => {
				if (ing.originalNumericQuantity === null) {
					return ing;
				}

				const scaledValue = ing.originalNumericQuantity * scaleFactor;
				const newDisplayQuantity = formatQuantityWithUnit(
					scaledValue,
					ing.quantity
				);

				return {
					...ing,
					displayQuantity: newDisplayQuantity,
				};
			});
			setDisplayIngredients(updatedIngredients);
		}

		setDisplayCalories(Math.round(originalCalories.current * scaleFactor));
		setDisplayProtein(Math.round(originalProtein.current * scaleFactor));
		setDisplayCarbs(Math.round(originalCarbs.current * scaleFactor));
		setDisplayFat(Math.round(originalFat.current * scaleFactor));
	}, [serves]);

	const handleIngredientPress = (ingredient: DisplayIngredient) => {
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
					<View className="flex-col gap-2">
						{data.tips.map((tip: any, index: any) => (
							<View
								key={`tip-${index}`}
								className="flex-row items-center gap-1 bg-gray100 rounded-md p-2"
							>
								<Text className="text-xl">💡</Text>
								<Text className="flex-1">{tip?.tip}</Text>
							</View>
						))}
					</View>
				</>
			)}

			{displayIngredients.length > 0 && (
				<>
					<Subtitle>Ingredients</Subtitle>
					<View className="flex-row items-center gap-2">
						<Pressable
							className="flex-row items-center justify-center size-6 bg-orange400 rounded-full p-2"
							onPress={() => setServes(Math.max(1, serves - 1))}
							disabled={serves <= 1}
							style={{ opacity: serves <= 1 ? 0.5 : 1 }}
						>
							<MinusIcon width={12} height={12} color="white" />
						</Pressable>
						<View className="flex-row items-center">
							<Text>{serves + ' '}</Text>
							<Text>serves</Text>
						</View>
						<Pressable
							className="flex-row items-center justify-center size-6 bg-orange400 rounded-full p-2"
							onPress={() => setServes(serves + 1)}
						>
							<PlusIcon width={12} height={12} color="white" />
						</Pressable>
					</View>
					<View className="flex-col gap-2 justify-start">
						{displayIngredients.map((ingredient, index) => (
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
								{ingredient?.displayQuantity && (
									<Text className="font-bold">
										{ingredient.displayQuantity}
									</Text>
								)}
								{ingredient?.ingredient && (
									<Text
										className="flex-1"
										style={{
											textDecorationLine: strikedThroughIngredients.includes(
												ingredient.ingredient
											)
												? 'line-through'
												: 'none',
										}}
									>
										{ingredient.ingredient}
									</Text>
								)}
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
									renderStepIngredients(step.step, displayIngredients)}
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

			{(displayProtein || displayCarbs || displayFat || displayCalories) && (
				<>
					<Subtitle>Nutrition Facts</Subtitle>
					<View className="flex-row justify-center items-center gap-10 px-8 py-3 bg-gray100 rounded-md">
						<View className="relative">
							<View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
								<Text className="heading-medium font-[800] text-center">
									{displayCalories}
								</Text>
								<Text className="text-center">Calories</Text>
							</View>
							<DonutChart
								data={[
									{
										value: displayProtein || 0,
										color: getTailwindHexColor('red300'),
										name: 'Protein',
									},
									{
										value: displayCarbs || 0,
										color: getTailwindHexColor('yellow400'),
										name: 'Carbohydrates',
									},
									{
										value: displayFat || 0,
										color: getTailwindHexColor('blue400'),
										name: 'Fat',
									},
								].filter((item) => item.value > 0)}
								strokeWidth={12}
								radius={60}
								containerWidth={135}
								containerHeight={135}
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
						<View className="flex-col justify-between py-6 p-2 rounded-md">
							{displayProtein > 0 && (
								<View className="flex-row items-center gap-2">
									<ProteinIcon
										width={24}
										height={24}
										color={getTailwindHexColor('red300')}
									/>
									<View className="flex-row items-center">
										<Text>Protein: </Text>
										<Text className="font-bold">{displayProtein}g</Text>
									</View>
								</View>
							)}
							{displayCarbs > 0 && (
								<View className="flex-row items-center gap-2">
									<CarbsIcon
										width={24}
										height={24}
										color={getTailwindHexColor('yellow400')}
									/>
									<View className="flex-row items-center">
										<Text>Carbs: </Text>
										<Text className="font-bold">{displayCarbs}g</Text>
									</View>
								</View>
							)}
							{displayFat > 0 && (
								<View className="flex-row items-center gap-2">
									<FatIcon
										width={24}
										height={24}
										color={getTailwindHexColor('blue400')}
									/>
									<View className="flex-row items-center">
										<Text>Fat: </Text>
										<Text className="font-bold">{displayFat}g</Text>
									</View>
								</View>
							)}
						</View>
					</View>
				</>
			)}
		</View>
	);
};

export default RecipeDisplay;
