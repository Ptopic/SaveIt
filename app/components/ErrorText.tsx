import { Text } from 'react-native';

const ErrorText = ({ error }: { error: string }) => {
	return <Text className="text-red600 text-sm ml-[2]">{error}</Text>;
};

export default ErrorText;
