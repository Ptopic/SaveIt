import Subtitle from '@/components/Subtitle';
import Text from '@/components/Text';
import { getEmoji, removeEmoji } from '@/utils/emoji';
import { View } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface IProps {
	text: string;
	width: number;
	title?: string;
	emoji?: string;
}

const InfoBox = ({ text, width, title, emoji }: IProps) => {
	const emojiFromText = getEmoji(text);
	const textWithoutEmoji = emojiFromText ? removeEmoji(text) : text;

	return (
		<View
			className={twMerge(
				'bg-gray50 border border-gray200 justify-center rounded-lg py-4 px-2 flex flex-col gap-3',
				title && 'p-2'
			)}
			style={{ width }}
		>
			{title && <Subtitle>{title}</Subtitle>}
			{title && <View className="bg-gray300 w-full h-[1px]" />}
			<View className="flex-row items-center gap-2">
				{emoji && <Text>{emoji}</Text>}
				{emojiFromText && <Text>{emojiFromText}</Text>}
				<Text className="flex-1 flex-wrap">{textWithoutEmoji}</Text>
			</View>
		</View>
	);
};

export default InfoBox;
