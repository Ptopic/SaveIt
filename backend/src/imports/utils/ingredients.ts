import axios from 'axios';

// Function to verify if the image exists using a HEAD request
export const verifyImageExists = async (url) => {
	try {
		const response = await axios.head(url);
		if (response.status === 200) {
			return true;
		}
	} catch (error) {
		return false;
	}
};

// Test function to get ingredient icons from TheMealDB
export async function getIngredientIcons(ingredients) {
	if (!ingredients) {
		ingredients = [
			'450g king oyster mushrooms, sliced',
			'1 tsp paprika',
			'1/2 tsp garlic powder',
			'Salt to taste',
			'1 tbsp balsamic vinegar',
			'A pinch of sugar',
			'2 zucchinis, sliced',
			'1 tsp dried Italian herbs',
			'4 tbsp vegan mayo',
			'1/2 tbsp tomato paste',
			'1 tsp agave',
			'3 tsp white wine vinegar',
			'1 tsp roasted curry powder',
			'Bread',
			'Lettuce',
			'Tomatoes',
			'Cilantro',
		];
	}

	const iconUrls = [];

	for (const ingredient of ingredients) {
		try {
			const ingredientVariations = generateIngredientVariations(ingredient);

			for (const variation of ingredientVariations) {
				const theMealDbUrl = `https://www.themealdb.com/images/ingredients/${encodeURIComponent(
					variation
				)}.png`;

				if (await verifyImageExists(theMealDbUrl)) {
					iconUrls.push({ ingredient: ingredient, url: theMealDbUrl });
					break;
				}

				try {
					const searchResponse = await axios.get(
						'https://api.spoonacular.com/food/ingredients/search',
						{
							params: {
								query: variation,
								number: 1,
								apiKey: process.env.SPOONACULAR_API_KEY,
							},
						}
					);

					if (
						searchResponse.data.results &&
						searchResponse.data.results.length > 0
					) {
						const spoonacularUrl = `https://spoonacular.com/cdn/ingredients_100x100/${searchResponse.data.results[0].image}`;

						if (await verifyImageExists(spoonacularUrl)) {
							iconUrls.push({ ingredient: ingredient, url: spoonacularUrl });
							break;
						}
					}
				} catch (error) {
					throw error;
				}
			}

			if (!iconUrls.find((i) => i.ingredient === ingredient)) {
				const placeholderUrl = `https://www.themealdb.com/images/ingredients/${encodeURIComponent(
					ingredient
				)}.png`;

				if (await verifyImageExists(placeholderUrl)) {
					iconUrls.push({ ingredient: ingredient, url: placeholderUrl }); // Store under the original ingredient name
				}
			}
		} catch (error) {
			throw error;
		}
	}

	console.log('\n--- RESULTS SUMMARY ---');
	console.log(`Total ingredients: ${ingredients.length}`);
	console.log(`Images found: ${iconUrls.length}`);

	return iconUrls;
}

export function generateIngredientVariations(ingredient) {
	const original = ingredient.trim();

	let cleaned = original
		.replace(/^\d+(\.\d+)?g\s+/, '')
		.replace(/^\d+(\.\d+)?\s*(tsp|tbsp|teaspoon|tablespoon)\s+/, '')
		.replace(/^a\s+pinch\s+of\s+/i, '')
		.replace(/^salt\s+to\s+taste$/i, 'salt')
		.replace(/,.*$/, '')
		.trim()
		.toLowerCase();

	const words = cleaned.split(' ');
	const baseIngredient =
		words.length > 1 ? words.slice(-2).join(' ') : words[0];

	const lastWord = words[words.length - 1];

	const specialCases = {
		'king oyster mushrooms': [
			'king oyster mushrooms',
			'oyster mushrooms',
			'mushrooms',
		],
		'oyster mushrooms': ['oyster mushrooms', 'mushrooms'],
		'vegan mayo': ['vegan mayonnaise', 'mayonnaise', 'mayo'],
		'vegan mayonnaise': ['vegan mayonnaise', 'mayonnaise'],
		'agave syrup': ['agave syrup', 'agave', 'syrup'],
		'curry powder': ['curry powder', 'curry'],
		'white wine vinegar': ['white wine vinegar', 'wine vinegar', 'vinegar'],
		'balsamic vinegar': ['balsamic vinegar', 'balsamic', 'vinegar'],
		'tomato paste': ['tomato paste', 'tomato'],
		'italian herbs': ['italian herbs', 'herbs'],
		'garlic powder': ['garlic powder', 'garlic'],
		'dried italian herbs': ['italian herbs', 'herbs'],
	};

	for (const [key, variations] of Object.entries(specialCases)) {
		if (cleaned.includes(key)) {
			return variations;
		}
	}

	const variations = [cleaned, baseIngredient, lastWord];

	return [...new Set(variations)];
}
