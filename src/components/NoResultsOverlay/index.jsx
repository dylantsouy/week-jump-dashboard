import NoData from '../NoData';
import './styles.scss';
import { Stack } from '@mui/material';

export default function NoResultsOverlay() {
    return (
        <Stack data-testid='NoResultsOverlay' height='100%' alignItems='center' justifyContent='center'>
            <NoData text='目前無任何紀錄' />
        </Stack>
    );
}
