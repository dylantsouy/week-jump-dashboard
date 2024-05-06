import { swrFetcher } from './apiSetup';
import useSWR from 'swr';
import dayjs from 'dayjs';

const useJumps = (props) => {
    const { startDate, range, closed } = props;
    let url = '/jumps';
    let queryParams = {};
    queryParams.closed = closed;
    if (range !== 3) {
        const formattedDate = dayjs(startDate).format('YYYYMMDD');
        queryParams.date = formattedDate;
    }
    const fullUrl = `${url}?${new URLSearchParams(queryParams)}`;
    const { data, mutate, isValidating } = useSWR([fullUrl, {}, 'GET'], swrFetcher, {
        revalidateOnFocus: false,
    });

    return { data: data?.data, mutate, isLoading: isValidating };
};

export default useJumps;
