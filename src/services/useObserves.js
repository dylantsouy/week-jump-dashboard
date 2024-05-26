import { swrFetcher } from './apiSetup';
import useSWR from 'swr';

const useObserves = (props) => {
    const { type } = props;
    let url = '/observes';
    let queryParams = {};
    if (type !== 4) {
        queryParams.type = type;
    }
    const fullUrl = `${url}?${new URLSearchParams(queryParams)}`;
    const { data, mutate, isValidating } = useSWR([fullUrl, {}, 'GET'], swrFetcher, {
        revalidateOnFocus: false,
    });

    return { data: data?.data, mutate, isLoading: isValidating };
};

export default useObserves;
