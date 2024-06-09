import dayjs from 'dayjs';
import { fetcher } from './apiSetup';

export const editJumpRecord = async (props) => {
    const { id } = props;
    const data = await fetcher(`/jumpRecords/${id}`, 'PUT', props);

    return data;
};

export const addJumps = async (props) => {
    const { startDate, range } = props;
    const date = dayjs(startDate).format('YYYYMMDD');
    const perd = range === 1 ? 'w' : 'm';
    const data = await fetcher(`/jumps`, 'POST', { date, perd });

    return data;
};

export const deleteJump = async (id) => {
    const data = await fetcher(`/jumps/${id}`, 'DELETE');

    return data;
};

export const deleteJumpRecord = async (id) => {
    const data = await fetcher(`/jumpRecords/${id}`, 'DELETE');

    return data;
};

export const updateIfClosed = async () => {
    const data = await fetcher(`/jumps/updateIfClosed`, 'POST');

    return data;
};

export const bulkDelete = async (ids) => {
    const data = await fetcher(`/bulkDelete/jumpRecords`, 'DELETE', { ids });

    return data;
};
