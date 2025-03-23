import { swrFetcher } from './apiSetup';
import useSWR from 'swr';

const useLoan = (props) => {
    const { code } = props;
    const { data, mutate, isValidating } = useSWR(code && [`/loans/${code}`, {}, 'GET'], swrFetcher, {
        revalidateOnFocus: false,
    });
    return { data: data?.data, mutate, isLoading: isValidating };
};

export default useLoan;
