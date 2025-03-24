import { config } from '@/shared/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants';

const getCollections = async (
	page = DEFAULT_PAGE,
	searchQuery = '',
	pageSize = DEFAULT_PAGE_SIZE
) => {
	const accessToken = await AsyncStorage.getItem('accessToken');

	const url = new URL(`${config.apiUrl}/collections`);
	url.searchParams.set('page', page);
	url.searchParams.set('searchQuery', searchQuery);
	url.searchParams.set('pageSize', pageSize);

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	});
	return response.json();
};

const getCollection = async (id: string) => {
	const accessToken = await AsyncStorage.getItem('accessToken');

	const response = await fetch(`${config.apiUrl}/collections/${id}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	});
	return response.json();
};

const createCollection = async (name: string, description: string) => {
	const accessToken = await AsyncStorage.getItem('accessToken');

	const response = await fetch(`${config.apiUrl}/collections`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({ name, description }),
	});
	return response.json();
};

const deleteCollection = async (id: string) => {
	const accessToken = await AsyncStorage.getItem('accessToken');

	const response = await fetch(`${config.apiUrl}/collections/${id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	});
	return response.json();
};

export default {
	getCollections,
	getCollection,
	createCollection,
	deleteCollection,
};
