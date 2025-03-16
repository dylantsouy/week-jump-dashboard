import { swrFetcher } from './apiSetup';
import useSWR from 'swr';

const useJump = (props) => {
    const { id } = props;
    const { data, mutate, isValidating } = useSWR(id && [`/jumps/${id}`, {}, 'GET'], swrFetcher, {
        revalidateOnFocus: false,
    });
    return { data: data?.data, mutate, isLoading: isValidating };
};

export default useJump;
