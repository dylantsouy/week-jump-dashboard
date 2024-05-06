import './styles.scss';
import { Stack } from '@mui/material';

export default function NoResultsText() {
    return (
        <Stack data-testid='NoResultsOverlay' height='100%' alignItems='center' justifyContent='center'>
            尚無資料
        </Stack>
    );
}
