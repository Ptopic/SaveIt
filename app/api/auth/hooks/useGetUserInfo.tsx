import { USER_INFO } from '@/api/constants';
import { IUser } from '@/api/user/types';
import { useQuery } from '@tanstack/react-query';
import authRequests from '../requests';

const useGetUserInfo = () => {
	return useQuery<IUser>({
		queryKey: [USER_INFO],
		queryFn: () => authRequests.me(),
	});
};

export default useGetUserInfo;
