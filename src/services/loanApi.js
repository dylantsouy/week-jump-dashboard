import { fetcher } from './apiSetup';

export const addLoans = async ({ date }) => {
    const data = await fetcher(`/loans`, 'POST', { date });

    return data;
};

export const bulkDeleteLoan = async (ids) => {
    const data = await fetcher(`/bulkDeleteLoan`, 'DELETE', { ids });

    return data;
};
