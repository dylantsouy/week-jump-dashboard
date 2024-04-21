import { swrFetcher } from './apiSetup';
import useSWR from 'swr';

const useNews = (props) => {
    const { targetId } = props;
    const { data, mutate, isValidating } = useSWR(targetId && [`/targets/${targetId}/news`, {}, 'GET'], swrFetcher, {
        revalidateOnFocus: false,
    });
    return { data: data?.data, mutate, isLoading: isValidating };
};

export default useNews;
