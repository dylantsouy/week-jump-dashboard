import './index.scss';
import { Button, IconButton } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import dayjs from 'dayjs';

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

    const handleRangeChange = (newRange) => {
        setRange(newRange);
        if (newRange === 1) {
            const startOfWeek = dayjs().subtract(1, 'week').startOf('week').day(1);
            const endOfWeek = dayjs().endOf('week').day(0);
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
                                <input type='week' className='hidden' value={dayjs(selectDate).format('YYYY-[W]WW')} onChange={handleWeekChange} />
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
                    <Button disabled={loading} className={`${range === 1 ? 'active' : ''} date-block`} variant={'contained'} color={'primary'} onClick={() => handleRangeChange(1)}>
                        周
                    </Button>
                    <Button disabled={loading} className={`${range === 2 ? 'active' : ''} date-block`} variant={'contained'} color={'primary'} onClick={() => handleRangeChange(2)}>
                        月
                    </Button>
                    <Button disabled={loading} className={`${range === 3 ? 'active' : ''} date-block`} variant={'contained'} color={'primary'} onClick={() => handleRangeChange(3)}>
                        All
                    </Button>
                </div>
            </div>
        </div>
    );
}
