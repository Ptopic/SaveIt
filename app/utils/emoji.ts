export const getEmoji = (text: string) => {
	return text.split(' ')[0];
};

export const removeEmoji = (text: string) => {
	return text.split(' ').slice(1).join(' ');
};
