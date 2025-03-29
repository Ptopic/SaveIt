import { StyleProp, Text as TextNative, TextStyle } from 'react-native';

const Text = ({
	children,
	className,
	style,
	...props
}: {
	children: React.ReactNode;
	className?: string;
	style?: StyleProp<TextStyle>;
}) => {
	const finalClassName = className ? className : 'body-small-regular';

	return (
		<TextNative className={finalClassName} style={style} {...props}>
			{children}
		</TextNative>
	);
};

export default Text;
