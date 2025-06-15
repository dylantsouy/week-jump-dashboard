import './index.scss';
import { listColumn } from '@/helpers/columnsJumps';
import { useState } from 'react';
import { Button, Skeleton, useMediaQuery, Drawer, IconButton } from '@mui/material';
import { generateMeasureTime } from '@/helpers/format';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import { useStore } from '@/stores/store';
import { useSnackbar } from 'notistack';
import usePermissionCheck from '@/helpers/usePermissionCheck';
import useJumps from '@/services/useJumps';
import JumpModal from '@/components/JumpModal';
import { addJumps, bulkDeleteJumps, deleteJump, updateIfClosed } from '@/services/jumpApi';
import DateRange from '@/components/DateRange';
import dayjs from 'dayjs';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { AddCircleOutline, Close, TuneRounded } from '@mui/icons-material';
import { createStock } from '@/services/stockApi';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import DataGrid from '@/components/DataGrid';
import FastSearchModal from '@/components/FastSearchModal';

function Jump() {
    const actionPermission = usePermissionCheck('action');
    const { setModalHandler, closeModal, setValue } = useStore();
    const [selectedRows, setSelectedRows] = useState([]);
    const [showRecordDialog, setShowRecordDialog] = useState(false);
    const [recordData, setRecordData] = useState(null);
    const [selectDate, setSelectDate] = useState(dayjs());
    const [startDate, setStartDate] = useState(() => {
        const today = dayjs();
        const weekday = today.day();
        return weekday === 0 ? today.subtract(6, 'day') : today.startOf('week').add(1, 'day');
    });

    const [endDate, setEndDate] = useState(() => {
        const today = dayjs();
        const weekday = today.day();
        return weekday === 0 ? today : today.endOf('week').subtract(1, 'day');
    });
    const [range, setRange] = useState(1);
    const [checked, setChecked] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width:700px)');
    const { enqueueSnackbar } = useSnackbar();
    const { isLoading: loading, data: listData, mutate, updatedDate } = useJumps({ range, startDate, closed: checked });
    const [showFastSearchDialog, setShowFastSearchDialog] = useState(false);
    const [propsStock, setPropsStock] = useState('');

    const handleCloseFastSearch = () => {
        setShowFastSearchDialog(false);
    };

    const showFastSearchHandler = (stock) => {
        setPropsStock(stock);
        setShowFastSearchDialog(true);
    };

    const confirmBulkDelete = async () => {
        setValue('modalLoading', true);
        try {
            let ids = selectedRows?.map((e) => e?.id);
            let result = await bulkDeleteJumps(ids);
            const { success, deletedCount } = result;
            if (success) {
                enqueueSnackbar(`成功刪除 ${deletedCount} 條記錄`, { variant: 'success' });
                handleCloseDelete(true);
                setSelectedRows([]);
                setValue('modalLoading', false);
            }
        } catch (err) {
            enqueueSnackbar('批量刪除失敗', { variant: 'error' });
            setValue('modalLoading', false);
        }
    };
    const bulkDeleteHandler = () => {
        if (selectedRows.length === 0) {
            enqueueSnackbar('請至少選擇一條記錄', { variant: 'warning' });
            return;
        }

        setModalHandler({
            func: confirmBulkDelete,
            text: (
                <div className='delete-content'>
                    <div className='delete-title'>
                        <div className='stock-set'>
                            <div className='stock-name-code'>
                                <div className='stock-name'>{'請確認是否刪除'}</div>
                                <div className='stock-code mr-1'>{`已選擇 ${selectedRows.length} 條跳空紀錄`}</div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        });
    };
    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    const addHandler = async () => {
        try {
            let result = await addJumps({ range, startDate });
            const { success } = result;
            if (success) {
                enqueueSnackbar('抓取成功', { variant: 'success' });
            }
        } catch (err) {
            enqueueSnackbar('抓取失敗', { variant: 'error' });
        }
    };

    const checkHandler = async () => {
        try {
            let result = await updateIfClosed({ range, startDate });
            const { success } = result;
            if (success) {
                enqueueSnackbar('檢查成功', { variant: 'success' });
            }
        } catch (err) {
            enqueueSnackbar('檢查失敗', { variant: 'error' });
        }
    };

    const showRecord = (e) => {
        let m = [];
        let w = [];
        let d = [];
        e?.JumpsRecords.forEach((r) => {
            if (r?.type === 'w') {
                w.push(r);
            } else if (r?.type === 'm') {
                m.push(r);
            } else {
                d.push(r);
            }
        });
        e.w = w;
        e.m = m;
        e.d = d;
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

    const confirmDelete = async (e) => {
        setValue('modalLoading', true);
        try {
            let result = await deleteJump(e?.id);
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
                                    {e?.Stock?.name} {e?.Stock?.code}
                                </div>
                                <div className='stock-name'>{'跳空紀錄'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        });
    };

    const refreshHandler = async () => {
        try {
            let result = await createStock();
            const { success } = result;
            if (success) {
                enqueueSnackbar('更新成功', { variant: 'success' });
            }
        } catch (err) {
            enqueueSnackbar('更新失敗', { variant: 'error' });
        }
    };
    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };
    return (
        <div className='TablePage Jump'>
            <div className='title'>
                <div className='title-left'>跳空清單</div>
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
                        <Button
                            className='act'
                            disabled={!actionPermission || range === 3}
                            variant='contained'
                            color='warning'
                            startIcon={<AddCircleOutline />}
                            onClick={addHandler}
                        >
                            抓取
                        </Button>
                        <Button disabled={!actionPermission} className='act' variant='contained' startIcon={<CloudSyncIcon />} onClick={refreshHandler}>
                            更新收盤價
                        </Button>
                        <Button className='act' disabled={!actionPermission} variant='contained' startIcon={<CloseFullscreenIcon />} onClick={checkHandler}>
                            檢查補上
                        </Button>
                        <Button className='act' disabled={!actionPermission || selectedRows.length === 0} variant='contained' color='error' onClick={bulkDeleteHandler}>
                            批量刪除 ({selectedRows.length})
                        </Button>
                    </div>
                    <div className='action-right'>
                        <DateRange
                            loading={loading}
                            selectDate={selectDate}
                            setSelectDate={setSelectDate}
                            startDate={startDate}
                            setStartDate={setStartDate}
                            endDate={endDate}
                            setEndDate={setEndDate}
                            range={range}
                            setRange={setRange}
                        />
                        <div className='switch'>
                            <FormControlLabel value='start' control={<Switch checked={checked} onChange={handleChange} color='primary' />} label='未補上' labelPlacement='start' />
                            <div className='switch-label'>補上</div>
                        </div>
                    </div>
                </div>
            )}

            <DataGrid
                ifShowSelect={true}
                setSelectedRows={setSelectedRows}
                isLoading={loading}
                rowData={listData}
                columnDefs={listColumn(showRecord, deleteHandler, actionPermission, showFastSearchHandler)}
            >
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
                                                disabled={!actionPermission || range === 3}
                                                variant='contained'
                                                color='warning'
                                                startIcon={<AddCircleOutline />}
                                                onClick={addHandler}
                                                fullWidth
                                            >
                                                抓取
                                            </Button>
                                            <Button
                                                disabled={!actionPermission}
                                                className='act'
                                                variant='contained'
                                                startIcon={<CloudSyncIcon />}
                                                onClick={refreshHandler}
                                                fullWidth
                                            >
                                                更新收盤價
                                            </Button>
                                            <Button
                                                className='act'
                                                disabled={!actionPermission}
                                                variant='contained'
                                                startIcon={<CloseFullscreenIcon />}
                                                onClick={checkHandler}
                                                fullWidth
                                            >
                                                檢查補上
                                            </Button>
                                            <Button
                                                className='act'
                                                disabled={!actionPermission || selectedRows.length === 0}
                                                variant='contained'
                                                color='error'
                                                onClick={bulkDeleteHandler}
                                                fullWidth
                                            >
                                                批量刪除 ({selectedRows.length})
                                            </Button>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '24px' }}>
                                        <h4 style={{ marginBottom: '8px' }}>日期設定</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <DateRange
                                                loading={loading}
                                                selectDate={selectDate}
                                                setSelectDate={setSelectDate}
                                                startDate={startDate}
                                                setStartDate={setStartDate}
                                                endDate={endDate}
                                                setEndDate={setEndDate}
                                                range={range}
                                                setRange={setRange}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <h4 style={{ marginBottom: '8px' }}>顯示選項</h4>
                                        <div className='switch' style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <FormControlLabel
                                                value='start'
                                                control={<Switch checked={checked} onChange={handleChange} color='primary' />}
                                                label='未補上'
                                                labelPlacement='start'
                                            />
                                            <div className='switch-label'>補上</div>
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
            <JumpModal loading={loading} actionPermission={actionPermission} open={showRecordDialog} handleClose={handleCloseRecord} recordData={recordData} mutate={mutate} />
            <FastSearchModal open={showFastSearchDialog} handleClose={handleCloseFastSearch} propsStock={propsStock} />
        </div>
    );
}

export default Jump;
