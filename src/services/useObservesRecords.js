import { swrFetcher } from './apiSetup';
import useSWR from 'swr';

const useObservesRecords = (props) => {
    const { observeId } = props;
    let url = '/observesRecords';
    const fullUrl = `${url}/${observeId}`;
    const { data, mutate, isValidating } = useSWR([fullUrl, {}, 'GET'], swrFetcher, {
        revalidateOnFocus: false,
    });

    return { data: data?.data, mutate, isLoading: isValidating };
};

export default useObservesRecords;
