import { IImport } from '@/api/imports/types';
import { DisplayIngredient } from '@/types/recipe';
import React, { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { ImportType } from '../home/FilterBadge/types';
import PlaceDisplay from './ImportTypeDIsplay/Place/PlacesDisplay';
import RecipesDisplay from './ImportTypeDIsplay/Recipe/RecipesDisplay';
import RestaurantsDisplay from './ImportTypeDIsplay/Restaurant/RestaurantsDIsplay';
import PlaceDetails from './ImportTypeModal/Place/PlaceDetails';
import RecipeDetails from './ImportTypeModal/Recipe/RecipeDetails';
import RestaurantDetails from './ImportTypeModal/Restaurant/RestaurantDetails';
export const displayImportType = (
	importType: ImportType,
	importData: IImport,
	handleItemPress: (item: any) => void
) => {
	switch (importType) {
		case ImportType.RESTAURANT:
			return (
				<RestaurantsDisplay
					restaurants={importData.restaurants}
					handleItemPress={handleItemPress}
				/>
			);
		case ImportType.PLACE:
			return (
				<PlaceDisplay
					places={importData.places}
					handleItemPress={handleItemPress}
				/>
			);
		case ImportType.RECIPE:
			return (
				<RecipesDisplay
					recipes={importData.recipes}
					handleItemPress={handleItemPress}
				/>
			);
		case ImportType.PRODUCT:
			return 'Product';
		case ImportType.EVENT:
			return 'Event';
		case ImportType.WORKOUT:
			return 'Workout Routine';
		case ImportType.BOOK:
			return 'Book';
		case ImportType.FILM:
			return 'Film/Show';
		case ImportType.SOFTWARE:
			return 'Software';
		case ImportType.OTHER:
			return 'Other';
		default:
			return null;
	}
};

export const displayImportTypeModal = (
	importType: ImportType,
	selectedItem: any,
	handleCloseModal: () => void,
	setIsExternalModalVisible?: Dispatch<SetStateAction<boolean>>,
	originalServes?: MutableRefObject<number>,
	serves?: number,
	setServes?: (serves: number) => void,
	displayIngredients?: DisplayIngredient[],
	setDisplayIngredients?: (displayIngredients: DisplayIngredient[]) => void
) => {
	switch (importType) {
		case ImportType.RESTAURANT:
			return (
				<RestaurantDetails
					restaurant={selectedItem}
					handleCloseModal={handleCloseModal}
				/>
			);
		case ImportType.PLACE:
			return (
				<PlaceDetails
					place={selectedItem}
					handleCloseModal={handleCloseModal}
				/>
			);
		case ImportType.RECIPE:
			return (
				<RecipeDetails
					recipe={selectedItem}
					handleCloseModal={handleCloseModal}
					setIsExternalModalVisible={setIsExternalModalVisible}
					originalServes={originalServes}
					serves={serves}
					setServes={setServes}
					displayIngredients={displayIngredients}
					setDisplayIngredients={setDisplayIngredients}
				/>
			);
		case ImportType.PRODUCT:
			return 'Product';
		case ImportType.EVENT:
			return 'Event';
		case ImportType.WORKOUT:
			return 'Workout Routine';
		case ImportType.BOOK:
			return 'Book';
		case ImportType.FILM:
			return 'Film/Show';
		case ImportType.SOFTWARE:
			return 'Software';
		case ImportType.OTHER:
			return 'Other';
		default:
			return null;
	}
};
