import './styles.scss';
import { Skeleton } from '@mui/material';

export default function DataGridSkeleton() {
    return (
        <>
            {Array(10)
                .fill(1)
                .map((e, i) => (
                    <Skeleton data-testid="data-grid-skeleton"  key={i} variant='rectangular' sx={{ my: 1, mx: 1 }} height={26} />
                ))}
        </>
    );
}
