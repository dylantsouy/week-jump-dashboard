import { swrFetcher } from './apiSetup';
import useSWR from 'swr';

const useNewsNames = (props) => {
    const { open,targetId } = props;

    const { data, mutate, isValidating } = useSWR(open && targetId && [`/targets/${targetId}/news/names`, {}, 'GET'], swrFetcher, {
        revalidateOnFocus: false,
    });
    return { data: data?.data, mutate, isLoading: isValidating };
};

export default useNewsNames;
