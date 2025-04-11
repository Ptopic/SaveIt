import Text from '@/components/Text';
import { getTailwindHexColor } from '@/utils/getTailwindColor';
import { TouchableOpacity } from 'react-native';
import { ImportType, ImportTypeOptions } from './types';

interface IProps {
	type: ImportType;
	activeFilter: string;
	setActiveFilter: (filter: string) => void;
}

const FilterBadgeButton = ({ type, activeFilter, setActiveFilter }: IProps) => {
	const { icon, title, value, bgColor, textColor } = ImportTypeOptions[type];
	const regularBgColorHex = getTailwindHexColor('gray100');

	const isActive = activeFilter === value;

	const isVisible = activeFilter === '';

	const toggleFilter = () => {
		isActive ? setActiveFilter('') : setActiveFilter(value);
	};

	return (
		<TouchableOpacity
			className="px-3 py-2 rounded-full flex gap-2 flex-row items-center"
			style={{
				backgroundColor: isActive ? bgColor : regularBgColorHex,
				borderWidth: isActive ? 1 : 0,
				borderColor: isActive ? textColor : 'transparent',
				display: isActive ? 'flex' : isVisible ? 'flex' : 'none',
			}}
			activeOpacity={1}
			onPress={toggleFilter}
		>
			{icon}
			<Text
				className="!font-medium body-small-regular"
				style={{ color: isActive ? textColor : 'black' }}
			>
				{title}
			</Text>
		</TouchableOpacity>
	);
};

export default FilterBadgeButton;
