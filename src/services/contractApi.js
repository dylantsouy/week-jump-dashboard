import { fetcher } from './apiSetup';

export const addContracts = async (props) => {
    const { quarter } = props;
    const data = await fetcher(`/contracts`, 'POST', { quarter });

    return data;
};
