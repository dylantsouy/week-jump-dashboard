import './index.scss';
import { listColumn } from '@/helpers/columnsJumps';
import { DataGrid } from '@mui/x-data-grid';
import { useRef, useState } from 'react';
import NoResultsOverlay from '@/components/NoResultsOverlay';
import DataGridSkeleton from '@/components/DataGridSkeleton';
import { Button, Skeleton } from '@mui/material';
import { generateMeasureTime } from '@/helpers/format';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import { useStore } from '@/stores/store';
import { useSnackbar } from 'notistack';
import usePermissionCheck from '@/helpers/usePermissionCheck';
import useJumps from '@/services/useJumps';
import JumpModal from '@/components/JumpModal';
import { addJumps, deleteJump, updateIfClosed } from '@/services/jumpApi';
import DateRange from '@/components/DateRange';
import dayjs from 'dayjs';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { AddCircleOutline } from '@mui/icons-material';
import CustomToolbar from '@/components/CustomToolbar';
import { localeText } from '@/helpers/datagridHelper';
import { createStock } from '@/services/stockApi';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';

function Jump() {
    const dashboardRef = useRef(null);
    const actionPermission = usePermissionCheck('action');
    const { setModalHandler, closeModal, setValue } = useStore();
    const [loadingAction, setLoadingAction] = useState(false);
    const [showRecordDialog, setShowRecordDialog] = useState(false);
    const [recordData, setRecordData] = useState(null);
    const [selectDate, setSelectDate] = useState(new Date());
    const [startDate, setStartDate] = useState(dayjs().startOf('week').day(1));
    const [endDate, setEndDate] = useState(dayjs().add(1, 'week').endOf('week').day(0));
    const [range, setRange] = useState(1);
    const [checked, setChecked] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const { isLoading: loading, data: listData, mutate, updatedDate } = useJumps({ range, startDate, closed: checked });

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    const addHandler = async () => {
        setLoadingAction(true);
        try {
            let result = await addJumps({ range, startDate });
            const { success } = result;
            if (success) {
                enqueueSnackbar('抓取成功', { variant: 'success' });
                setLoadingAction(false);
            }
        } catch (err) {
            enqueueSnackbar('抓取失敗', { variant: 'error' });
            setLoadingAction(false);
        }
    };

    const checkHandler = async () => {
        setLoadingAction(true);
        try {
            let result = await updateIfClosed({ range, startDate });
            const { success } = result;
            if (success) {
                enqueueSnackbar('檢查成功', { variant: 'success' });
                setLoadingAction(false);
            }
        } catch (err) {
            enqueueSnackbar('檢查失敗', { variant: 'error' });
            setLoadingAction(false);
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
        setLoadingAction(true);
        try {
            let result = await createStock();
            const { success } = result;
            if (success) {
                enqueueSnackbar('更新成功', { variant: 'success' });
                setLoadingAction(false);
            }
        } catch (err) {
            enqueueSnackbar('更新失敗', { variant: 'error' });
            setLoadingAction(false);
        }
    };
    return (
        <div className='Dashboard'>
            <div className='dashboard-header'>
                <div className='header-left'>
                    <div className='title'>跳空清單</div>
                </div>
                <div className='header-right'>
                    <div className='title'>
                        收盤價更新: <div className='flex-center'>{loading ? <Skeleton variant='text' width={135} /> : generateMeasureTime(updatedDate)}</div>{' '}
                        <span className='mins'>(每日 14:00 後更新)</span>
                    </div>
                </div>
            </div>
            <div className='title-action'>
                <div className='title-btns'>
                    <Button className='act' disabled={!actionPermission || range === 3} variant='contained' color='warning' startIcon={<AddCircleOutline />} onClick={addHandler}>
                        抓取
                    </Button>
                    <Button disabled={!actionPermission} className='act' variant='contained' startIcon={<CloudSyncIcon />} onClick={refreshHandler}>
                        更新收盤價
                    </Button>
                    <Button className='act' disabled={!actionPermission} variant='contained' startIcon={<CloseFullscreenIcon />} onClick={checkHandler}>
                        檢查補上
                    </Button>
                </div>
                <div className='date'>
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
            <div className='container'>
                <div className='table-wrapper'>
                    <DataGrid
                        className='table-root'
                        ref={dashboardRef}
                        rows={loading ? [] : listData || []}
                        getRowId={(row) => row.id}
                        columns={listColumn(showRecord, deleteHandler, actionPermission, range)}
                        loading={loading}
                        disableSelectionOnClick
                        componentsProps={{
                            pagination: {
                                labelRowsPerPage: '每頁筆數:',
                            },
                        }}
                        localeText={localeText()}
                        initialState={{
                            sorting: {
                                sortModel: [{ field: 'gapPercent', sort: 'desc' }],
                            },
                        }}
                        density='compact'
                        sortingOrder={['desc', 'asc']}
                        components={{
                            Toolbar: CustomToolbar,
                            NoRowsOverlay: NoResultsOverlay,
                            NoResultsOverlay: NoResultsOverlay,
                            LoadingOverlay: DataGridSkeleton,
                        }}
                    />
                </div>
            </div>
            <JumpModal loading={loading} actionPermission={actionPermission} open={showRecordDialog} handleClose={handleCloseRecord} recordData={recordData} mutate={mutate} />
        </div>
    );
}

export default Jump;
