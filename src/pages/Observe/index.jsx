import './index.scss';
import { listColumn } from '@/helpers/columnsObserves';
import { useState } from 'react';
import { Button, Skeleton, TextField, IconButton, Tooltip } from '@mui/material';
import { generateMeasureTime } from '@/helpers/format';
import { useStore } from '@/stores/store';
import { useSnackbar } from 'notistack';
import usePermissionCheck from '@/helpers/usePermissionCheck';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { AddCircleOutline, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import useObserves from '@/services/useObserves';
import ObserveRecordModal from '@/components/ObserveRecordModal';
import { deleteObserve } from '@/services/observe';
import AddObserveModal from '@/components/AddObserveModal';
import EditObserveModal from '@/components/EditObserveModal';
import DataGrid from '@/components/DataGrid';

function Observe() {
    const actionPermission = usePermissionCheck('action');
    const { setModalHandler, closeModal, setValue } = useStore();
    const [showRecordDialog, setShowRecordDialog] = useState(false);
    const [recordData, setRecordData] = useState(null);
    const [type, setType] = useState(2);

    // 獲取今天的日期，格式為 YYYY-MM-DD
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };
    const todayDate = getTodayDate();

    // 設定最小允許日期為 2025-03-16
    const minDate = '2025-03-16';

    const [date, setDate] = useState(getTodayDate());
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editData, setEditData] = useState(null);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    // 修改 useObserves 的調用，只在 usingDate 為真時加入 date 參數
    const {
        isLoading: loading,
        data: listData,
        mutate,
        updatedDate,
    } = useObserves({
        type,
        date: date,
    });

    // 處理日期變更的函數
    const handleDateChange = (e) => {
        const newDate = e.target.value;
        // 檢查新日期是否大於今天
        if (newDate > todayDate) {
            enqueueSnackbar('不能選擇未來的日期', { variant: 'warning' });
            return;
        }
        // 檢查新日期是否小於最小允許日期
        if (newDate < minDate) {
            enqueueSnackbar('不能選擇2025-03-16之前的日期', { variant: 'warning' });
            return;
        }
        setDate(newDate);
    };

    // 日期前進一天
    const handleNextDay = () => {
        const currentDate = new Date(date);
        currentDate.setDate(currentDate.getDate() + 1);
        const newDate = currentDate.toISOString().split('T')[0];
        if (newDate <= todayDate) {
            setDate(newDate);
        }
    };

    // 日期後退一天
    const handlePrevDay = () => {
        const currentDate = new Date(date);
        currentDate.setDate(currentDate.getDate() - 1);
        const newDate = currentDate.toISOString().split('T')[0];
        if (newDate >= minDate) {
            setDate(newDate);
        } else {
            enqueueSnackbar('不能選擇2025-03-16之前的日期', { variant: 'warning' });
        }
    };

    // 返回今天
    const handleToday = () => {
        setDate(todayDate);
    };

    // 清除日期過濾
    const handleClearDate = () => {
        setDate('');
    };

    // 其他原有的函數保持不變
    const editHandler = (e) => {
        setEditData(e);
        setShowEditDialog(true);
    };

    const handleCloseEdit = (refresh) => {
        setShowEditDialog(false);
        if (refresh) {
            mutate();
        }
    };

    const addHandler = () => {
        setShowAddDialog(true);
    };

    const handleCloseAdd = (refresh) => {
        setShowAddDialog(false);
        if (refresh) {
            mutate();
        }
    };

    const showRecord = (e) => {
        setRecordData(e);
        setShowRecordDialog(true);
    };

    const handleCloseRecord = () => {
        setShowRecordDialog(false);
    };

    const handleCloseDelete = (refresh) => {
        closeModal(false);
        if (refresh) {
            mutate();
        }
    };
    const isToday = date === todayDate;
    const isMinDate = date === minDate;

    const handleTypeChange = (e) => {
        const newRange = +e.target.value;
        setType(newRange);
    };

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

    return (
        <div className='TablePage Observe'>
            <div className='title'>
                <div className='title-left'>動能清單</div>

                <div className='title-right'>
                    收盤價更新: <div className='flex-center'>{loading ? <Skeleton variant='text' width={135} /> : generateMeasureTime(updatedDate)}</div>{' '}
                    <span className='mins'>(每日 14:00 後更新)</span>
                </div>
            </div>
            <div className='title-action'>
                <div className='action-left'>
                    <Button className='act' disabled={!actionPermission} variant='contained' color='warning' startIcon={<AddCircleOutline />} onClick={addHandler}>
                        新增
                    </Button>
                </div>
                <div className='action-right'>
                    <div className='date-picker-container' style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                        <Tooltip title={isMinDate ? '已到可選最早日期' : '前一天'}>
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
                        <Tooltip title={isToday ? '已是今天' : '後一天'}>
                            <IconButton size='small' onClick={handleNextDay} disabled={loading || isToday}>
                                <ArrowForwardIos fontSize='small' />
                            </IconButton>
                        </Tooltip>
                        <div>
                            <Button variant='outlined' size='small' onClick={handleToday} disabled={loading || isToday} style={{ marginRight: '8px' }}>
                                今天
                            </Button>
                            <Button variant='outlined' size='small' onClick={handleClearDate} disabled={loading} color='secondary'>
                                不過濾
                            </Button>
                        </div>
                    </div>
                    <ToggleButtonGroup color='primary' value={type} exclusive onChange={handleTypeChange} aria-label='Platform'>
                        <ToggleButton disabled={loading} variant={'contained'} color={'primary'} value={3}>
                            熱水
                        </ToggleButton>
                        <ToggleButton disabled={loading} variant={'contained'} color={'primary'} value={2}>
                            溫水
                        </ToggleButton>
                        <ToggleButton disabled={loading} variant={'contained'} color={'primary'} value={1}>
                            冷水
                        </ToggleButton>
                        <ToggleButton disabled={loading} variant={'contained'} color={'primary'} value={4}>
                            全部
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
            </div>
            <DataGrid rowData={listData} columnDefs={listColumn(showRecord, deleteHandler, editHandler, actionPermission)} isLoading={loading}>
                <div></div>
            </DataGrid>
            <AddObserveModal open={showAddDialog} handleClose={handleCloseAdd} />
            <EditObserveModal open={showEditDialog} handleClose={handleCloseEdit} editData={editData} />
            <ObserveRecordModal
                loading={loading}
                actionPermission={actionPermission}
                open={showRecordDialog}
                handleClose={handleCloseRecord}
                recordData={recordData}
                mutate={mutate}
            />
        </div>
    );
}

export default Observe;
