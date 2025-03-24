import { StyleSheet, Text } from 'react-native';

const Subtitle = ({ children }: { children: React.ReactNode }) => {
	return <Text style={styles.subtitle}>{children}</Text>;
};

export default Subtitle;

const styles = StyleSheet.create({
	subtitle: {
		fontSize: 16,
		fontWeight: 'bold',
	},
});
