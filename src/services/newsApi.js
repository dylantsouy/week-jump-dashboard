import { fetcher } from './apiSetup';

export const editNews = async (props) => {
    const { newsId } = props;
    const data = await fetcher(`/news/${newsId}`, 'PUT', props);

    return data;
};

export const addNews = async (props) => {
    const data = await fetcher(`/news`, 'POST', props);

    return data;
};

export const deleteNews = async (id) => {
    const data = await fetcher(`/news/${id}`, 'DELETE');

    return data;
};
