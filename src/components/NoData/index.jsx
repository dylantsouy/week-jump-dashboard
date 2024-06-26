import Box from '@mui/material/Box';
import './index.scss';
import { NoDataIcon } from '@/assets/icons';

export default function NoData(props) {
    const {text} = props;
    return (
        <Box className='NoData'>
            <NoDataIcon />
            <div className='nodata-title'>尚無資料</div>
            <div className='nodata-sub'>{text}</div>
        </Box>
    );
}
