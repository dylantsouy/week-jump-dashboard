import { fetcher } from './apiSetup';

export const createStock = async () => {
    const data = await fetcher(`/stocks`, 'POST');

    return data;
};
