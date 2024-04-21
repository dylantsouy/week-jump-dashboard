import { swrFetcher } from './apiSetup';
import useSWR from 'swr';

const useLastDate = () => {
    const { data, isValidating } = useSWR(['/UpdatePredicate/Last', 'GET'], swrFetcher, {
        revalidateOnFocus: false,
    });

    return { data: data?.result?.UpdateTime, isLoading: isValidating };
};

export default useLastDate;
