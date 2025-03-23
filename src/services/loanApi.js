import { fetcher } from './apiSetup';

export const addLoans = async () => {
    const data = await fetcher(`/loans`, 'POST', {});

    return data;
};
