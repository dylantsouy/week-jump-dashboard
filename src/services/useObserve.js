import { swrFetcher } from './apiSetup';
import useSWR from 'swr';

const useObserve = (props) => {
    const { id } = props;
    const { data, mutate, isValidating } = useSWR(id && [`/observes/${id}`, {}, 'GET'], swrFetcher, {
        revalidateOnFocus: false,
    });
    return { data: data?.data, mutate, isLoading: isValidating };
};

export default useObserve;
