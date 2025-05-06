import { IRecipe } from '@/api/imports/types';
import {
	formatQuantityWithUnit,
	parseQuantityString,
} from '@/feature/import/quantityUtils';
import {
	CarbsIcon,
	FatIcon,
	MinusIcon,
	PlayIcon,
	PlusIcon,
	ProteinIcon,
} from '@/shared/svgs';
import { DisplayIngredient } from '@/types/recipe';
import { getTailwindHexColor } from '@/utils/getTailwindColor';
import React, {
	Dispatch,
	MutableRefObject,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { DonutChart } from 'react-native-circular-chart';
import Subtitle from '../Subtitle';
import Text from '../Text';
import { renderStepIngredients } from './utils';

interface IProps {
	data: IRecipe;
	setIsExternalModalVisible?: Dispatch<SetStateAction<boolean>>;
	originalServes?: MutableRefObject<number>;
	serves?: number;
	setServes?: (serves: number) => void;
	displayIngredients?: DisplayIngredient[];
	setDisplayIngredients?: (displayIngredients: DisplayIngredient[]) => void;
}

const RecipeDisplay = ({
	data,
	setIsExternalModalVisible,
	originalServes,
	serves = 1,
	setServes,
	displayIngredients = [],
	setDisplayIngredients,
}: IProps) => {
	const [strikedThroughIngredients, setStrikedThroughIngredients] = useState<
		string[]
	>([]);

	const handleIngredientPress = (ingredient: DisplayIngredient) => {
		if (strikedThroughIngredients.includes(ingredient.ingredient)) {
			setStrikedThroughIngredients((prev) =>
				prev.filter((i) => i !== ingredient.ingredient)
			);
		} else {
			setStrikedThroughIngredients((prev) => [...prev, ingredient.ingredient]);
		}
	};

	const originalCalories = useRef(0);
	const originalProtein = useRef(0);
	const originalCarbs = useRef(0);
	const originalFat = useRef(0);

	const [displayCalories, setDisplayCalories] = useState(0);
	const [displayProtein, setDisplayProtein] = useState(0);
	const [displayCarbs, setDisplayCarbs] = useState(0);
	const [displayFat, setDisplayFat] = useState(0);

	const chartData = [
		{
			value: displayProtein || 0,
			color: getTailwindHexColor('red300') || '#FF0000',
			name: 'Protein',
		},
		{
			value: displayCarbs || 0,
			color: getTailwindHexColor('yellow400') || '#FFFF00',
			name: 'Carbohydrates',
		},
		{
			value: displayFat || 0,
			color: getTailwindHexColor('blue400') || '#0000FF',
			name: 'Fat',
		},
	].filter((item) => item && typeof item.value === 'number' && item.value > 0);

	useEffect(() => {
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
		if (
			!originalServes ||
			originalServes.current === 0 ||
			!setDisplayIngredients ||
			!data.ingredients
		) {
			if (originalServes && serves === originalServes.current) {
				setDisplayCalories(originalCalories.current);
				setDisplayProtein(originalProtein.current);
				setDisplayCarbs(originalCarbs.current);
				setDisplayFat(originalFat.current);
			}
			return;
		}

		const currentOriginalServes = originalServes.current;
		if (currentOriginalServes === 0) return;

		const scaleFactor = serves / currentOriginalServes;

		const updatedIngredients: DisplayIngredient[] = data.ingredients.map(
			(ing) => {
				const originalNumericQuantity = parseQuantityString(ing.quantity);
				if (originalNumericQuantity === null) {
					return {
						...ing,
						displayQuantity: ing.quantity,
						originalNumericQuantity: null,
					};
				}

				const scaledValue = originalNumericQuantity * scaleFactor;
				const newDisplayQuantity = formatQuantityWithUnit(
					scaledValue,
					ing.quantity
				);

				return {
					...ing,
					displayQuantity: newDisplayQuantity,
					originalNumericQuantity: originalNumericQuantity,
				};
			}
		);
		setDisplayIngredients(updatedIngredients);

		setDisplayCalories(Math.round(originalCalories.current * scaleFactor));
		setDisplayProtein(Math.round(originalProtein.current * scaleFactor));
		setDisplayCarbs(Math.round(originalCarbs.current * scaleFactor));
		setDisplayFat(Math.round(originalFat.current * scaleFactor));
	}, [serves, originalServes, data.ingredients, setDisplayIngredients]);

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

			{(displayIngredients.length > 0 || data.ingredients?.length > 0) && (
				<>
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
								onPress={() =>
									handleIngredientPress && handleIngredientPress(ingredient)
								}
								style={{
									opacity: strikedThroughIngredients?.includes(
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
											textDecorationLine: strikedThroughIngredients?.includes(
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
					<View className="flex-row items-center justify-between">
						<Subtitle>Steps</Subtitle>
						<Pressable
							className="bg-gray100 rounded-md p-2 flex-row items-center gap-2"
							onPress={() =>
								setIsExternalModalVisible && setIsExternalModalVisible(true)
							}
						>
							<PlayIcon
								width={18}
								height={18}
								color={getTailwindHexColor('green400')}
							/>
							<Text>Start</Text>
						</Pressable>
					</View>
					<View className="flex-col gap-2 justify-start">
						{data.steps.map((step: any, index: any) => (
							<View
								className="flex-row gap-2 items-start justify-start p-2 bg-gray100 rounded-md"
								key={`step-${index}-${step?.step?.substring(0, 10)}`}
							>
								{step?.emoji && <Text className="mt-0.5">{step.emoji}</Text>}
								{step?.step && (
									<View className="flex-1">
										{renderStepIngredients(step.step, displayIngredients)}
									</View>
								)}
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

			{(displayProtein !== 0 || displayCarbs !== 0 || displayFat !== 0) && (
				<View>
					<Subtitle>Nutrition Facts</Subtitle>
					<View className="flex-row justify-center items-center gap-10 px-8 py-3 bg-gray100 rounded-md">
						<View className="relative">
							<View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
								<Text className="heading-medium font-[800] text-center">
									{displayCalories}
								</Text>
								<Text className="text-center">Calories</Text>
							</View>
							{chartData.length > 0 && (
								<DonutChart
									data={chartData}
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
							)}
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
				</View>
			)}
		</View>
	);
};

export default RecipeDisplay;
