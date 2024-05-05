import './index.scss';
import { listColumn } from '@/helpers/columnsJumps';
import { DataGrid } from '@mui/x-data-grid';
import { useRef, useState } from 'react';
import NoResultsOverlay from '@/components/NoResultsOverlay';
import DataGridSkeleton from '@/components/DataGridSkeleton';
import { Button, Skeleton } from '@mui/material';
import { generateMeasureTime } from '@/helpers/format';
import { AddCircleOutline } from '@mui/icons-material';
import { useStore } from '@/stores/store';
import { useSnackbar } from 'notistack';
import usePermissionCheck from '@/helpers/usePermissionCheck';
import useJumps from '@/services/useJumps';
import JumpModal from '@/components/JumpModal';
import { addJumps, deleteJump } from '@/services/jumpApi';
import DateRange from '@/components/DateRange';
import dayjs from 'dayjs';

function Jump() {
    const dashboardRef = useRef(null);
    const actionPermission = usePermissionCheck('action');
    const { setModalHandler, closeModal, setValue } = useStore();
    const [loadingAction, setLoadingAction] = useState(false);
    const [showRecordDialog, setShowRecordDialog] = useState(false);
    const [recordData, setRecordData] = useState(null);
    const [selectDate, setSelectDate] = useState(new Date());
    const [startDate, setStartDate] = useState(dayjs().subtract(1, 'week').startOf('week').day(1));
    const [endDate, setEndDate] = useState(dayjs().endOf('week').day(0));
    const [range, setRange] = useState(1);
    const { enqueueSnackbar } = useSnackbar();

    const { isLoading: loading, data: listData, mutate, updatedDate } = useJumps({ range, startDate });

    const addHandler = async () => {
        setLoadingAction(true);
        try {
            let result = await addJumps({ range, startDate });
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

    return (
        <div className='Dashboard'>
            <div className='dashboard-header'>
                <div className='header-left'>
                    <div className='title'>觀察清單</div>
                </div>
                <div className='header-right'>
                    <div className='title'>
                        收盤價更新: <div className='flex-center'>{loading ? <Skeleton variant='text' width={135} /> : generateMeasureTime(updatedDate)}</div>{' '}
                        <span className='mins'>(每日 14:00 後更新)</span>
                    </div>
                </div>
            </div>
            <div className='title-action'>
                <Button
                    className='act'
                    disabled={loadingAction || !actionPermission || range === 3}
                    variant='contained'
                    color='warning'
                    startIcon={<AddCircleOutline />}
                    onClick={addHandler}
                >
                    抓取
                </Button>
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
                </div>
            </div>
            <div className='container'>
                <div className='table-wrapper'>
                    <DataGrid
                        className='table-root'
                        ref={dashboardRef}
                        rows={loading ? [] : listData || []}
                        getRowId={(row) => row.id}
                        columns={listColumn(showRecord, deleteHandler, actionPermission)}
                        loading={loading}
                        disableSelectionOnClick
                        componentsProps={{
                            pagination: {
                                labelRowsPerPage: '每頁筆數:',
                            },
                        }}
                        localeText={{
                            columnMenuUnsort: '不排序',
                            columnMenuSortAsc: '升冪排序',
                            columnMenuSortDesc: '降冪排序',
                            columnMenuShowColumns: '顯示欄位',
                            columnMenuHideColumn: '隱藏欄位',
                            toolbarExport: '輸出報表',
                            toolbarExportCSV: '下載為 CSV',
                            columnMenuFilter: '過濾',
                            filterOperatorContains: '包含',
                            filterOperatorEquals: '完全相符',
                            filterOperatorStartsWith: '開頭為',
                            filterOperatorEndsWith: '結束於',
                            filterOperatorIsEmpty: '為空',
                            filterOperatorIsNotEmpty: '不為空',
                            filterOperatorIsAnyOf: '複選',
                            filterPanelColumns: '欄位',
                            filterPanelInputLabel: '值',
                            filterPanelOperators: '條件',
                            filterPanelInputPlaceholder: '請輸入值',
                            toolbarColumns: '欄位',
                            columnsPanelHideAllButton: '隱藏全部',
                            columnsPanelShowAllButton: '顯示全部',
                            columnsPanelTextFieldPlaceholder: '輸入欄位名稱',
                            columnsPanelTextFieldLabel: '欄位名稱',
                            toolbarFilters: '過濾',
                        }}
                        initialState={{
                            sorting: {
                                sortModel: [{ field: 'newestDate', sort: 'desc' }],
                            },
                        }}
                        density='compact'
                        sortingOrder={['desc', 'asc']}
                        components={{
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
