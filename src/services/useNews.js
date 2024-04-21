import { swrFetcher } from './apiSetup';
import useSWR from 'swr';

const useNews = (props) => {
    const { newsId } = props;

    const { data, mutate, isValidating } = useSWR(newsId && [`/news/${newsId}`, {}, 'GET'], swrFetcher, {
        revalidateOnFocus: false,
    });
    let result = {
        newsId,
        sort: data?.data?.sort,
        status: data?.data?.status,
        date: data?.data?.date,
        type: data?.data?.type,
        name: data?.data?.name,
        content: data?.data?.content,
        fromWhere: data?.data?.fromWhere,
    };

    return { data: result, mutate, isLoading: isValidating };
};

export default useNews;
