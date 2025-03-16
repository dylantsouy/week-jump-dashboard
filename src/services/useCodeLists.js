import { swrFetcher } from './apiSetup';
import useSWR from 'swr';

const useCodeLists = (props) => {
    const { open, codeLists } = props;

    const { data, mutate, isValidating } = useSWR(open && !codeLists?.length && [`/stocks/codes`, {}, 'GET'], swrFetcher, {
        revalidateOnFocus: false,
    });

    return { data: data?.data, mutate, isLoading: isValidating };
};

export default useCodeLists;
