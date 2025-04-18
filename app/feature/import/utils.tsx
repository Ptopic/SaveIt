import { IImport } from '@/api/imports/types';
import { ImportType } from '../home/FilterBadge/types';
import PlaceDisplay from './ImportTypeDIsplay/Place/PlacesDisplay';
import PlaceDetailsModal from './ImportTypeModal/Place/PlaceDetailsModal';

export const displayImportType = (
	importType: ImportType,
	importData: IImport,
	handleItemPress: (item: any) => void
) => {
	switch (importType) {
		case ImportType.RESTAURANT:
			return 'Restaurant';
		case ImportType.PLACE:
			return (
				<PlaceDisplay
					places={importData.places}
					handleItemPress={handleItemPress}
				/>
			);
		case ImportType.RECIPE:
			return 'Recipe';
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
	handleCloseModal: () => void
) => {
	switch (importType) {
		case ImportType.RESTAURANT:
			return 'Restaurant';
		case ImportType.PLACE:
			return (
				<PlaceDetailsModal
					place={selectedItem}
					handleCloseModal={handleCloseModal}
				/>
			);
		case ImportType.RECIPE:
			return 'Recipe';
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
