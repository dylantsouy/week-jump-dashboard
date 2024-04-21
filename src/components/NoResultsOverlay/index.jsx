import './styles.scss';
import { Stack } from '@mui/material';

export default function NoResultsOverlay() {
    return (
        <Stack data-testid='NoResultsOverlay' height='100%' alignItems='center' justifyContent='center'>
            無資料
        </Stack>
    );
}
