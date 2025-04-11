import { CloseIcon } from '@/shared/svgs';
import { getTailwindHexColor } from '@/utils/getTailwindColor';
import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import FilterBadgeButton from './FilterBadge/FilterBadgeButton';
import { ImportType } from './FilterBadge/types';

interface IProps {
	activeFilter: string;
	setActiveFilter: (filter: string) => void;
}

const FiltersToolbar = ({ activeFilter, setActiveFilter }: IProps) => {
	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={{ gap: 10 }}
		>
			{activeFilter && (
				<TouchableOpacity
					className="flex items-center justify-center"
					onPress={() => setActiveFilter('')}
				>
					<CloseIcon
						height={24}
						width={24}
						color={getTailwindHexColor('gray700')}
					/>
				</TouchableOpacity>
			)}
			<FilterBadgeButton
				type={ImportType.RESTAURANT}
				activeFilter={activeFilter}
				setActiveFilter={setActiveFilter}
			/>
			<FilterBadgeButton
				type={ImportType.PLACE}
				activeFilter={activeFilter}
				setActiveFilter={setActiveFilter}
			/>
			<FilterBadgeButton
				type={ImportType.RECIPE}
				activeFilter={activeFilter}
				setActiveFilter={setActiveFilter}
			/>
			<FilterBadgeButton
				type={ImportType.PRODUCT}
				activeFilter={activeFilter}
				setActiveFilter={setActiveFilter}
			/>
			<FilterBadgeButton
				type={ImportType.EVENT}
				activeFilter={activeFilter}
				setActiveFilter={setActiveFilter}
			/>
			<FilterBadgeButton
				type={ImportType.WORKOUT}
				activeFilter={activeFilter}
				setActiveFilter={setActiveFilter}
			/>
			<FilterBadgeButton
				type={ImportType.BOOK}
				activeFilter={activeFilter}
				setActiveFilter={setActiveFilter}
			/>
			<FilterBadgeButton
				type={ImportType.FILM}
				activeFilter={activeFilter}
				setActiveFilter={setActiveFilter}
			/>
			<FilterBadgeButton
				type={ImportType.SOFTWARE}
				activeFilter={activeFilter}
				setActiveFilter={setActiveFilter}
			/>
			<FilterBadgeButton
				type={ImportType.OTHER}
				activeFilter={activeFilter}
				setActiveFilter={setActiveFilter}
			/>
		</ScrollView>
	);
};

export default FiltersToolbar;
