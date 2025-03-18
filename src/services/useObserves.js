import { swrFetcher } from './apiSetup';
import useSWR from 'swr';

const useObserves = (props) => {
    const { type, date } = props;
    let url = '/observes';
    let queryParams = {};

    // 加入 type 參數，如果不是全部（4）
    if (type !== 4) {
        queryParams.type = type;
    }

    // 加入 date 參數，如果有提供日期
    if (date) {
        queryParams.date = date;
    }

    const fullUrl = `${url}?${new URLSearchParams(queryParams)}`;
    const { data, mutate, isValidating } = useSWR([fullUrl, {}, 'GET'], swrFetcher, {
        revalidateOnFocus: false,
    });
    let updatedDate = data?.data?.[0]?.stockUpdatedAt;

    return { data: data?.data, mutate, updatedDate, isLoading: isValidating };
};

export default useObserves;
