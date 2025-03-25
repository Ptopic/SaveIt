import { Text } from 'react-native';

const Subtitle = ({ children }: { children: React.ReactNode }) => {
	return <Text className="text-lg font-bold">{children}</Text>;
};

export default Subtitle;
