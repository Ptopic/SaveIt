import { USER_INFO } from '@/api/constants';
import { useQuery } from '@tanstack/react-query';
import authRequests from '../requests';

const useGetUserInfo = () => {
	return useQuery({
		queryKey: [USER_INFO],
		queryFn: () => authRequests.me(),
	});
};

export default useGetUserInfo;
