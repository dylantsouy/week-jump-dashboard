import { swrFetcher } from './apiSetup';
import useSWR from 'swr';

const useCodeLists = (props) => {
    const { open } = props;

    const { data, mutate, isValidating } = useSWR(open && [`/stocks/codes`, {}, 'GET'], swrFetcher, {
        revalidateOnFocus: false,
    });

    return { data: data?.data, mutate, isLoading: isValidating };
};

export default useCodeLists;
