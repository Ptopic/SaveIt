import { StyleProp, Text as TextNative, TextStyle } from 'react-native';

const Text = ({
	children,
	className,
	style,
	numberOfLines,
	...props
}: {
	children: React.ReactNode;
	className?: string;
	style?: StyleProp<TextStyle>;
	numberOfLines?: number;
}) => {
	const finalClassName = className ? className : 'body-small-regular';

	return (
		<TextNative
			className={finalClassName}
			style={style}
			numberOfLines={numberOfLines}
			{...props}
		>
			{children}
		</TextNative>
	);
};

export default Text;
