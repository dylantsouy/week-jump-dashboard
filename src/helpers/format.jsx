import moment from 'moment';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { Tooltip } from '@mui/material';
import AlarmIcon from '@mui/icons-material/Alarm';
import { AlarmOff } from '@mui/icons-material';

export const generateMeasureDate = (e) => {
    return moment(e).format('YYYY-MM-DD');
};

export const generateMeasureTime = (e) => {
    return moment(e).format('YYYY-MM-DD HH:mm:ss');
};
export const dateGap = (e) => {
    return moment().diff(moment(e), 'days');
};
export const rateMapping = (e) => {
    const map = {
        1: <div className='bg best'>持有</div>,
        2: <div className='bg best'>看好</div>,
        3: <div className='bg good'>有機會</div>,
        4: <div className='bg neutral'>需等待</div>,
        5: <div className='bg neutral'>待觀察</div>,
        6: <div className='bg neutral'>中立</div>,
        7: <div className='bg neutral'>已反應</div>,
        8: <div className='bg bad'>有風險</div>,
        9: <div className='bg bad'>中立偏空</div>,
        10: <div className='bg worst'>不看好</div>,
    };

    return map[e];
};

export const profitHandler = (e) => {
    if (e < -20) {
        return <div className='worst-text'>{e}%</div>;
    } else if (e < -10) {
        return <div className='bad-text'>{e}%</div>;
    } else if (e < 3) {
        return <div className='neutral-text'>{e}%</div>;
    } else if (e < 10) {
        return <div className='good-text'>{e}%</div>;
    } else {
        return <div className='best-text'>{e}%</div>;
    }
};

export const typeMapping = (e) => {
    const map = {
        1: (
            <Tooltip title='利多' placement='bottom' className='news-type success'>
                <SentimentSatisfiedAltIcon />
            </Tooltip>
        ),
        2: (
            <Tooltip title='利空' placement='bottom' className='news-type warning'>
                <SentimentVeryDissatisfiedIcon />
            </Tooltip>
        ),
        3: (
            <Tooltip title='中立' placement='bottom' className='news-type gray'>
                <SentimentNeutralIcon />
            </Tooltip>
        ),
    };

    return map[e];
};

export const statusMapping = (e) => {
    const map = {
        1: (
            <Tooltip title='時間未到' placement='bottom' className='news-type gray'>
                <AlarmIcon />
            </Tooltip>
        ),
        2: (
            <Tooltip title='提前完成' placement='bottom' className='news-type success'>
                <AlarmIcon />
            </Tooltip>
        ),
        3: (
            <Tooltip title='準時完成' placement='bottom' className='news-type success'>
                <AlarmIcon />
            </Tooltip>
        ),
        4: (
            <Tooltip title='延後完成' placement='bottom' className='news-type warning'>
                <AlarmIcon />
            </Tooltip>
        ),
        5: (
            <Tooltip title='延後未完' placement='bottom' className='news-type warning'>
                <AlarmIcon />
            </Tooltip>
        ),
        6: (
            <Tooltip title='狀況不明' placement='bottom' className='news-type warning'>
                <AlarmIcon />
            </Tooltip>
        ),
        7: (
            <Tooltip title='悲觀延後' placement='bottom' className='news-type warning'>
                <AlarmIcon />
            </Tooltip>
        ),
        8: (
            <Tooltip title='樂觀準時' placement='bottom' className='news-type success'>
                <AlarmIcon />
            </Tooltip>
        ),
        9: (
            <Tooltip title='無時效性' placement='bottom' className='news-type gray'>
                <AlarmOff />
            </Tooltip>
        ),
    };

    return map[e];
};
