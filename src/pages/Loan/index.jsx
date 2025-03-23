import './index.scss';
import { listColumn } from '@/helpers/columnsLoans';
import { useState, useEffect, useCallback } from 'react';
import { Button, Skeleton, TextField, IconButton, Tooltip, Drawer, useMediaQuery } from '@mui/material';
import { generateMeasureTime } from '@/helpers/format';
import { useStore } from '@/stores/store';
import { useSnackbar } from 'notistack';
import usePermissionCheck from '@/helpers/usePermissionCheck';
import { AddCircleOutline, ArrowBackIos, ArrowForwardIos, TuneRounded, Close } from '@mui/icons-material';
import { deleteObserve } from '@/services/observe';
import DataGrid from '@/components/DataGrid';
import useLoans from '@/services/useLoans';
import { addLoans } from '@/services/loanApi';
import LoanRecordModal from '@/components/LoanRecordModal';

function Loan() {
    const actionPermission = usePermissionCheck('action');
    const { setModalHandler, closeModal, setValue } = useStore();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [showRecordDialog, setShowRecordDialog] = useState(false);
    const [recordData, setRecordData] = useState(null);

    const showRecord = (e) => {
        setRecordData(e);
        setShowRecordDialog(true);
    };

    const handleCloseRecord = () => {
        setShowRecordDialog(false);
    };

    const isWeekend = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDay();
        return day === 0 || day === 6;
    };

    const getLastWeekday = (dateString) => {
        const date = new Date(dateString);
        let day = date.getDay();

        if (day === 0) {
            date.setDate(date.getDate() - 2);
        } else if (day === 6) {
            date.setDate(date.getDate() - 1);
        }

        return date.toISOString().split('T')[0];
    };

    const getNextWeekday = (dateString) => {
        const date = new Date(dateString);
        let day = date.getDay();
        let daysToAdd = 1;

        if (day === 5) {
            daysToAdd = 3;
        } else if (day === 6) {
            daysToAdd = 2;
        }

        date.setDate(date.getDate() + daysToAdd);
        return date.toISOString().split('T')[0];
    };

    const getPreviousWeekday = (dateString) => {
        const date = new Date(dateString);
        let day = date.getDay();
        let daysToSubtract = 1;

        if (day === 1) {
            daysToSubtract = 3;
        } else if (day === 0) {
            daysToSubtract = 2;
        }

        date.setDate(date.getDate() - daysToSubtract);
        return date.toISOString().split('T')[0];
    };

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const todayDate = getTodayDate();
    const minDate = '2025-03-21';

    const getInitialDate = useCallback(() => {
        const today = getTodayDate();
        return isWeekend(today) ? getLastWeekday(today) : today;
    }, []);

    const [date, setDate] = useState(getInitialDate());

    useEffect(() => {
        setDate(getInitialDate());
    }, [getInitialDate]);

    const { enqueueSnackbar } = useSnackbar();
    const isSmallScreen = useMediaQuery('(max-width:700px)');

    const {
        isLoading: loading,
        data: listData,
        mutate,
        updatedDate,
    } = useLoans({
        date: date,
    });

    const handleDateChange = (e) => {
        const newDate = e.target.value;

        if (newDate > todayDate) {
            enqueueSnackbar('不能選擇未來的日期', { variant: 'error' });
            return;
        }

        if (newDate < minDate) {
            enqueueSnackbar('不能選擇2025-03-16之前的日期', { variant: 'error' });
            return;
        }

        if (isWeekend(newDate)) {
            enqueueSnackbar('不能選擇週六或週日', { variant: 'error' });
            return;
        }

        setDate(newDate);
    };

    const handleNextDay = () => {
        const currentDate = new Date(date);
        const nextDate = getNextWeekday(currentDate.toISOString().split('T')[0]);

        if (nextDate <= todayDate) {
            setDate(nextDate);
        }
    };

    const handlePrevDay = () => {
        const currentDate = new Date(date);
        const prevDate = getPreviousWeekday(currentDate.toISOString().split('T')[0]);

        if (prevDate >= minDate) {
            setDate(prevDate);
        } else {
            enqueueSnackbar('不能選擇2025-03-16之前的日期', { variant: 'error' });
        }
    };

    const handleToday = () => {
        if (isWeekend(todayDate)) {
            setDate(getLastWeekday(todayDate));
            enqueueSnackbar('今天是週末，已設定為最近的週五', { variant: 'success' });
        } else {
            setDate(todayDate);
        }
    };

    const handleClearDate = () => {
        setDate('');
    };

    const addHandler = async () => {
        try {
            let result = await addLoans();
            const { success } = result;
            if (success) {
                if (result?.isExisting) {
                    enqueueSnackbar('最新資料已存在', { variant: 'error' });
                    return;
                }
                enqueueSnackbar('抓取成功', { variant: 'success' });
            }
        } catch (err) {
            enqueueSnackbar('抓取失敗', { variant: 'error' });
        }
    };

    const handleCloseDelete = (refresh) => {
        closeModal(false);
        if (refresh) {
            mutate();
        }
    };

    const isToday = date === (isWeekend(todayDate) ? getLastWeekday(todayDate) : todayDate);
    const isMinDate = date === minDate;

    const confirmDelete = async (e) => {
        setValue('modalLoading', true);
        try {
            let result = await deleteObserve(e?.id);
            const { success } = result;
            if (success) {
                enqueueSnackbar('刪除成功', { variant: 'success' });
                handleCloseDelete(true);
                setValue('modalLoading', false);
            }
        } catch (err) {
            enqueueSnackbar('刪除失敗', { variant: 'error' });
            setValue('modalLoading', false);
        }
    };

    const deleteHandler = (e) => {
        setModalHandler({
            func: () => confirmDelete(e),
            text: (
                <div className='delete-content'>
                    <div className='delete-title'>
                        <div className='stock-set'>
                            <div className='stock-name-code'>
                                <div className='stock-name'>{'請確認是否刪除'}</div>
                                <div className='stock-code mr-1'>
                                    {e?.name} {e?.code}
                                </div>
                                <div className='stock-name'>{'觀察紀錄'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        });
    };

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <div className='TablePage Observe'>
            <div className='title'>
                <div className='title-left'>動能清單</div>

                <div className='title-right'>
                    收盤價更新: <div className='flex-center'>{loading ? <Skeleton variant='text' width={135} /> : generateMeasureTime(updatedDate)}</div>{' '}
                    <span className='mins'>(每日 14:00 後更新)</span>
                </div>
            </div>
            {isSmallScreen ? (
                <div className='mb-1'></div>
            ) : (
                <div className='title-action'>
                    <div className='action-left'>
                        <Button className='act' disabled={!actionPermission} variant='contained' color='warning' startIcon={<AddCircleOutline />} onClick={addHandler}>
                            抓取
                        </Button>
                    </div>
                    <div className='action-right'>
                        <div className='date-picker-container' style={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title={isMinDate ? '已到可選最早日期' : '前一個工作日'}>
                                <IconButton size='small' onClick={handlePrevDay} disabled={loading || isMinDate}>
                                    <ArrowBackIos fontSize='small' />
                                </IconButton>
                            </Tooltip>
                            <TextField
                                id='date'
                                label={'觀察日期'}
                                type='date'
                                value={date}
                                onChange={handleDateChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    max: todayDate,
                                    min: minDate,
                                }}
                                size='small'
                                disabled={loading}
                            />
                            <Tooltip title={isToday ? '已是今天或最近的工作日' : '後一個工作日'}>
                                <IconButton size='small' onClick={handleNextDay} disabled={loading || isToday}>
                                    <ArrowForwardIos fontSize='small' />
                                </IconButton>
                            </Tooltip>
                            <div>
                                <Button variant='outlined' size='small' onClick={handleToday} disabled={loading || isToday} style={{ marginRight: '8px' }}>
                                    今天
                                </Button>
                                <Button variant='outlined' size='small' onClick={handleClearDate} disabled={loading} color='secondary'>
                                    所有時間
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <DataGrid rowData={listData} columnDefs={listColumn(showRecord)} isLoading={loading}>
                <div>
                    {isSmallScreen && (
                        <>
                            <Drawer anchor='right' open={drawerOpen} onClose={toggleDrawer}>
                                <div style={{ width: '320px', padding: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <h3 style={{ margin: 0 }}>篩選選項</h3>
                                        <IconButton onClick={toggleDrawer}>
                                            <Close />
                                        </IconButton>
                                    </div>

                                    <div style={{ marginBottom: '24px' }}>
                                        <h4 style={{ marginBottom: '8px' }}>操作</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <Button
                                                className='act'
                                                disabled={!actionPermission}
                                                variant='contained'
                                                color='warning'
                                                startIcon={<AddCircleOutline />}
                                                onClick={addHandler}
                                            >
                                                抓取
                                            </Button>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '24px' }}>
                                        <h4 style={{ marginBottom: '16px' }}>日期選擇</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <IconButton size='small' onClick={handlePrevDay} disabled={loading || isMinDate}>
                                                    <ArrowBackIos fontSize='small' />
                                                </IconButton>
                                                <TextField
                                                    id='date'
                                                    label={'觀察日期'}
                                                    type='date'
                                                    value={date}
                                                    onChange={handleDateChange}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    inputProps={{
                                                        max: todayDate,
                                                        min: minDate,
                                                    }}
                                                    size='small'
                                                    disabled={loading}
                                                    fullWidth
                                                />
                                                <IconButton size='small' onClick={handleNextDay} disabled={loading || isToday}>
                                                    <ArrowForwardIos fontSize='small' />
                                                </IconButton>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <Button variant='outlined' size='small' onClick={handleToday} disabled={loading || isToday} fullWidth>
                                                    今天
                                                </Button>
                                                <Button variant='outlined' size='small' onClick={handleClearDate} disabled={loading} color='secondary' fullWidth>
                                                    所有時間
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Drawer>
                            <IconButton color='primary' onClick={toggleDrawer} style={{ marginLeft: '10px' }}>
                                <TuneRounded />
                            </IconButton>
                        </>
                    )}
                </div>
            </DataGrid>
            <LoanRecordModal open={showRecordDialog} handleClose={handleCloseRecord} recordData={recordData} />
        </div>
    );
}

export default Loan;
