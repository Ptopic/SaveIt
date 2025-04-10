import Text from '@/components/Text';
import { getTailwindHexColor } from '@/utils/getTailwindColor';
import { TouchableOpacity } from 'react-native';

interface IProps {
	title: string;
	value: string;
	icon: React.ReactNode;
	bgColor: string;
	textColor: string;
	activeFilter: string;
	setActiveFilter: (filter: string) => void;
}

const FilterBadge = ({
	title,
	value,
	icon,
	bgColor,
	textColor,
	activeFilter,
	setActiveFilter,
}: IProps) => {
	const bgColorHex = getTailwindHexColor(bgColor);
	const textColorHex = getTailwindHexColor(textColor);
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
				backgroundColor: isActive ? bgColorHex : regularBgColorHex,
				borderWidth: isActive ? 1 : 0,
				borderColor: isActive ? textColorHex : 'transparent',
				display: isActive ? 'flex' : isVisible ? 'flex' : 'none',
			}}
			activeOpacity={1}
			onPress={toggleFilter}
		>
			{icon}
			<Text
				className="!font-medium body-small-regular"
				style={{ color: isActive ? textColorHex : 'black' }}
			>
				{title}
			</Text>
		</TouchableOpacity>
	);
};

export default FilterBadge;
