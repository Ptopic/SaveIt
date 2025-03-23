import { StyleSheet, Text } from 'react-native';

const ErrorText = ({ error }: { error: string }) => {
	return <Text style={styles.errorText}>{error}</Text>;
};

export default ErrorText;

const styles = StyleSheet.create({
	errorText: {
		color: 'red',
		fontSize: 12,
		marginLeft: 2,
	},
});
