import { swrFetcher } from './apiSetup';
import useSWR from 'swr';

const useContracts = (props) => {
    const { range, rank, quarter } = props;
    let url = '/contracts';
    let queryParams = {};

    if (quarter) {
        queryParams.quarter = quarter;
    }
    if (rank) {
        queryParams.rank = rank;
    }
    if (range) {
        queryParams.range = range;
    }

    const fullUrl = `${url}?${new URLSearchParams(queryParams)}`;
    const { data, mutate, isValidating } = useSWR([fullUrl, {}, 'GET'], swrFetcher, {
        revalidateOnFocus: false,
    });
    let updatedDate = data?.data?.[0]?.updatedAt;
    return { data: data?.data, mutate, updatedDate, isLoading: isValidating };
};

export default useContracts;
