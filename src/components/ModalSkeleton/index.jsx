import './styles.scss';
import { Skeleton } from '@mui/material';

export default function ModalSkeleton() {
    return (
        <>
            {Array(4)
                .fill(1)
                .map((e, i) => (
                    <div key={i}>
                        <Skeleton data-testid='data-grid-skeleton' variant='text' sx={{ my: 1 }} width={100} height={34} />
                        <Skeleton data-testid='data-grid-skeleton' variant='rectangular' sx={{ my: 1 }} height={16} />
                        <Skeleton data-testid='data-grid-skeleton' variant='rectangular' sx={{ my: 1 }} height={16} />
                        <Skeleton data-testid='data-grid-skeleton' variant='rectangular' sx={{ my: 1 }} height={16} />
                    </div>
                ))}
        </>
    );
}
