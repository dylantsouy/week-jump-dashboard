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

export const calculateTargetPriceRange = (eps2025, averagePE) => {
    const [minPE, maxPE] = averagePE.split('~').map(Number);
    const minTargetPrice = (eps2025 * minPE).toFixed(0);
    const maxTargetPrice = (eps2025 * maxPE).toFixed(0);

    return [minTargetPrice, maxTargetPrice];
};

export const targetColorHandler = (now, target1, target2) => {
    const diff1 = now < target1 ? ((target1 - now) / now) * 100 : -((now - target1) / target1) * 100;
    const diff2 = now < target2 ? ((target2 - now) / now) * 100 : -((now - target2) / target2) * 100;
    let result1;
    let result2;
    if (diff1 < -30) {
        result1 = <div className='worst-text'>{target1}</div>;
    } else if (diff1 < 0) {
        result1 = <div className='bad-text'>{target1}</div>;
    } else if (diff1 < 10) {
        result1 = <div className='neutral-text'>{target1}</div>;
    } else if (diff1 < 30) {
        result1 = <div className='good-text'>{target1}</div>;
    } else {
        result1 = <div className='best-text'>{target1}</div>;
    }
    if (diff2 < -30) {
        result2 = <div className='worst-text'>{target2}</div>;
    } else if (diff2 < 0) {
        result2 = <div className='bad-text'>{target2}</div>;
    } else if (diff2 < 10) {
        result2 = <div className='neutral-text'>{target2}</div>;
    } else if (diff2 < 30) {
        result2 = <div className='good-text'>{target2}</div>;
    } else {
        result2 = <div className='best-text'>{target2}</div>;
    }
    return (
        <div className='flex_center'>
            <Tooltip title={`${diff1?.toFixed(0)}%`} placement='bottom'>
                {result1}
            </Tooltip>
            ~
            <Tooltip title={`${diff2?.toFixed(0)}%`} placement='bottom'>
                {result2}
            </Tooltip>
        </div>
    );
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
    if (e < -30) {
        return <div className='worst-text'>{e}%</div>;
    } else if (e < 0) {
        return <div className='bad-text'>{e}%</div>;
    } else if (e < 10) {
        return <div className='neutral-text'>{e}%</div>;
    } else if (e < 30) {
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

export const jumpTypeMapping = (e) => {
    const map = {
        d: <div className='bg neutral'>日</div>,
        w: <div className='bg good'>周</div>,
        m: <div className='bg best'>月</div>,
    };

    return map[e];
};
