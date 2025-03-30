import { USER_INFO } from '@/api/constants';
import { useQuery } from '@tanstack/react-query';
import authRequests from '../requests';
import { IUser } from '../types';

const useGetUserInfo = () => {
	return useQuery<IUser>({
		queryKey: [USER_INFO],
		queryFn: () => authRequests.me(),
	});
};

export default useGetUserInfo;
