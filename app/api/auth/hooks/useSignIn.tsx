import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import auth from '../requests';

const useSignIn = (options?: UseMutationOptions<any, Error, any, unknown>) => {
	return useMutation({
		mutationFn: ({ email, password }: { email: string; password: string }) =>
			auth.signin(email, password),
		...options,
	});
};

export default useSignIn;
