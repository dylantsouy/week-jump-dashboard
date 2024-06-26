import { swrFetcher } from './apiSetup';
import useSWR from 'swr';
import dayjs from 'dayjs';

const useJumps = (props) => {
    const { startDate, range, closed } = props;
    const rangeMap = {
        1: 'w',
        2: 'm',
        3: 'all',
    };
    let url = '/jumps';
    let queryParams = {};
    queryParams.closed = closed;
    queryParams.type = rangeMap[range];
    if (range !== 3) {
        const formattedDate = dayjs(startDate).format('YYYYMMDD');
        queryParams.date = formattedDate;
    }
    const fullUrl = `${url}?${new URLSearchParams(queryParams)}`;
    const { data, mutate, isValidating } = useSWR([fullUrl, {}, 'GET'], swrFetcher, {
        revalidateOnFocus: false,
    });
    let updatedDate = data?.data?.[0]?.Stock?.updatedAt;

    return { data: data?.data, mutate, updatedDate, isLoading: isValidating };
};

export default useJumps;
