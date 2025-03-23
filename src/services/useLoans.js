import { swrFetcher } from './apiSetup';
import useSWR from 'swr';

const useLoans = (props) => {
    const { date } = props;
    let url = '/loans';
    let queryParams = {};

    if (date) {
        queryParams.date = date;
    }

    const fullUrl = `${url}?${new URLSearchParams(queryParams)}`;
    const { data, mutate, isValidating } = useSWR([fullUrl, {}, 'GET'], swrFetcher, {
        revalidateOnFocus: false,
    });
    let updatedDate = data?.data?.[0]?.updatedAt;
    console.log(updatedDate);

    return { data: data?.data, mutate, updatedDate, isLoading: isValidating };
};

export default useLoans;
