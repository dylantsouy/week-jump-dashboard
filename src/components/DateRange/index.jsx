import './index.scss';
import { IconButton } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import dayjs from 'dayjs';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

export default function DateRange(props) {
    const { loading, selectDate, setSelectDate, startDate, setStartDate, endDate, setEndDate, range, setRange } = props;

    const handlePrev = () => {
        let newStartDate, newEndDate;
        if (range === 1) {
            newStartDate = dayjs(startDate).subtract(1, 'week').startOf('week').day(1);
            newEndDate = dayjs(endDate).subtract(1, 'week').endOf('week').day(0);
        } else if (range === 2) {
            newStartDate = dayjs(startDate).subtract(1, 'month').startOf('month');
            newEndDate = dayjs(startDate).subtract(1, 'month').endOf('month');
        }
        setStartDate(newStartDate.toDate());
        setEndDate(newEndDate.toDate());
        setSelectDate(newStartDate.toDate());
    };

    const handleNext = () => {
        let newStartDate, newEndDate;
        if (range === 1) {
            newStartDate = dayjs(startDate).add(1, 'week').startOf('week').day(1);
            newEndDate = dayjs(endDate).add(1, 'week').endOf('week').day(0);
        } else if (range === 2) {
            newStartDate = dayjs(startDate).add(1, 'month').startOf('month');
            newEndDate = dayjs(endDate).add(1, 'month').endOf('month');
        }
        setStartDate(newStartDate.toDate());
        setEndDate(newEndDate.toDate());
        setSelectDate(newStartDate.toDate());
    };

    const handleWeekChange = (e) => {
        const { value } = e.target;
        const [year, week] = value.split('-W');
        const startOfWeek = dayjs().year(year).week(week).startOf('week').day(1);
        const endOfWeek = dayjs().year(year).week(week).endOf('week').day(0);
        setStartDate(startOfWeek.toDate());
        setEndDate(endOfWeek.toDate());
        setSelectDate(startOfWeek.toDate());
    };

    const handleMonthChange = (e) => {
        const { value } = e.target;
        const [year, month] = value.split('-');
        const startOfMonth = dayjs()
            .year(year)
            .month(parseInt(month) - 1)
            .startOf('month');
        const endOfMonth = dayjs()
            .year(year)
            .month(parseInt(month) - 1)
            .endOf('month');
        setStartDate(startOfMonth.toDate());
        setEndDate(endOfMonth.toDate());
        setSelectDate(startOfMonth.toDate());
    };

    const handleRangeChange = (e) => {
        const newRange = +e.target.value;
        setRange(newRange);
        if (newRange === 1) {
            const startOfWeek = dayjs().startOf('week').day(1);
            const endOfWeek = dayjs().add(1, 'week').endOf('week').day(0);
            setStartDate(startOfWeek.toDate());
            setEndDate(endOfWeek.toDate());
            setSelectDate(startOfWeek.toDate());
        } else if (newRange === 2) {
            const startOfMonth = dayjs().startOf('month');
            const endOfMonth = dayjs().endOf('month');
            setStartDate(startOfMonth.toDate());
            setEndDate(endOfMonth.toDate());
            setSelectDate(startOfMonth.toDate());
        }
    };
    return (
        <div className='picker-area'>
            {range != 3 ? (
                <div className='time-area'>
                    <>
                        <IconButton className='arrow' onClick={handlePrev} disabled={loading}>
                            <KeyboardArrowLeft />
                        </IconButton>
                        <div className='time-range'>
                            <>
                                {dayjs(startDate).format('YYYY/MM/DD')} ~ {dayjs(endDate).format('YYYY/MM/DD')}
                            </>
                            {range === 1 ? (
                                <input type='week' className='hidden' value={`${dayjs(selectDate).format('YYYY')}-W${dayjs(selectDate).isoWeek()}`} onChange={handleWeekChange} />
                            ) : (
                                <input disabled={loading} type='month' className='hidden' value={dayjs(selectDate).format('YYYY-MM')} onChange={handleMonthChange} />
                            )}
                        </div>
                        <IconButton className='arrow' onClick={handleNext} disabled={loading}>
                            <KeyboardArrowRight />
                        </IconButton>
                    </>
                </div>
            ) : (
                <div className='time-area fake'></div>
            )}
            <div className='date-range-outer'>
                <div className='date-range'>
                    <ToggleButtonGroup color='primary' value={range} exclusive onChange={handleRangeChange} aria-label='Platform'>
                        <ToggleButton disabled={loading} variant={'contained'} color={'primary'} value={1}>
                            周
                        </ToggleButton>
                        <ToggleButton disabled={loading} variant={'contained'} color={'primary'} value={2}>
                            月
                        </ToggleButton>
                        <ToggleButton disabled={loading} variant={'contained'} color={'primary'} value={3}>
                            全
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
            </div>
        </div>
    );
}
