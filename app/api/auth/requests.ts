import { config } from '@/shared/config';

const signin = async (email: string, password: string) => {
	const response = await fetch(`${config.apiUrl}/auth/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email, password }),
	});
	return response.json();
};

const signup = async (email: string, password: string) => {
	const response = await fetch(`${config.apiUrl}/auth/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email, password }),
	});
	return response.json();
};

export default { signin, signup };
