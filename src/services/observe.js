import { fetcher } from './apiSetup';

export const editObserve = async (props) => {
    const { id } = props;
    const data = await fetcher(`/observes/${id}`, 'PUT', props);

    return data;
};

export const editObserveRecord = async (props) => {
    const { id } = props;
    const data = await fetcher(`/observesRecords/${id}`, 'PUT', props);

    return data;
};

export const addObserve = async (props) => {
    const data = await fetcher(`/observesRecords`, 'POST', props);

    return data;
};

export const deleteObserve = async (id) => {
    const data = await fetcher(`/observes/${id}`, 'DELETE');

    return data;
};

export const deleteObserveRecord = async (props) => {
    const { id, recordData } = props;
    let deleteAll = false;
    if (recordData?.observe1Count + recordData?.observe2Count === 1) {
        deleteAll = true;
    }
    if (recordData?.observe3Count > 0) {
        deleteAll = false;
    }
    const data = await fetcher(`/observesRecords/${id}`, 'DELETE', { deleteAll, observeId: recordData?.id });

    return data;
};
