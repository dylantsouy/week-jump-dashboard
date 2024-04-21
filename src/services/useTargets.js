import { swrFetcher } from './apiSetup';
import useSWR from 'swr';

const useTargets = () => {
    const { data, mutate, isValidating } = useSWR(['/targets', {}, 'GET'], swrFetcher, {
        revalidateOnFocus: false,
    });

    let updatedDate = data?.data?.[0]?.stockUpdatedAt;

    return { data: data?.data, updatedDate, mutate, isLoading: isValidating };
};

export default useTargets;
