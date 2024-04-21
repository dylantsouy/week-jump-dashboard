import { fetcher } from './apiSetup';

export const editTarget = async (props) => {
    const { id } = props;
    const data = await fetcher(`/targets/${id}`, 'PUT', props);

    return data;
};

export const addTarget = async (props) => {
    const data = await fetcher(`/targets`, 'POST', props);

    return data;
};

export const deleteTarget = async (id) => {
    const data = await fetcher(`/targets/${id}`, 'DELETE');

    return data;
};