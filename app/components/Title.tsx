import { StyleSheet, Text } from 'react-native';

const Title = ({ children }: { children: React.ReactNode }) => {
	return <Text style={styles.title}>{children}</Text>;
};

export default Title;

const styles = StyleSheet.create({
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
});
