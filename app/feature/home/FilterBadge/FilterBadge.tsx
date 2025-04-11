import Text from '@/components/Text';
import { getTailwindHexColor } from '@/utils/getTailwindColor';
import { View } from 'react-native';
import { ImportType, ImportTypeOptions } from './types';

interface IProps {
	type: ImportType;
	alwaysActive?: boolean;
}

const FilterBadge = ({ type, alwaysActive }: IProps) => {
	const { icon, title, bgColor, textColor } = ImportTypeOptions[type];
	const regularBgColorHex = getTailwindHexColor('gray100');

	return (
		<View
			className="px-3 py-2 rounded-full flex gap-2 flex-row items-center"
			style={{
				backgroundColor: alwaysActive ? bgColor : regularBgColorHex,
				borderWidth: alwaysActive ? 1 : 0,
				borderColor: alwaysActive ? textColor : 'transparent',
				alignSelf: 'flex-start',
			}}
		>
			{icon}
			<Text
				className="!font-medium body-small-regular"
				style={{ color: alwaysActive ? textColor : 'black' }}
			>
				{title}
			</Text>
		</View>
	);
};

export default FilterBadge;
