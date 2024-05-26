import './index.scss';
import { listColumn } from '@/helpers/columnsObserves';
import { DataGrid } from '@mui/x-data-grid';
import { useRef, useState } from 'react';
import NoResultsOverlay from '@/components/NoResultsOverlay';
import DataGridSkeleton from '@/components/DataGridSkeleton';
import { Button, Skeleton } from '@mui/material';
import { generateMeasureTime } from '@/helpers/format';
import { useStore } from '@/stores/store';
import { useSnackbar } from 'notistack';
import usePermissionCheck from '@/helpers/usePermissionCheck';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { AddCircleOutline } from '@mui/icons-material';
import useObserves from '@/services/useObserves';
import ObserveRecordModal from '@/components/ObserveRecordModal';
import { deleteObserve } from '@/services/observe';
import AddObserveModal from '@/components/AddObserveModal';
import EditObserveModal from '@/components/EditObserveModal';

function Observe() {
    const dashboardRef = useRef(null);
    const actionPermission = usePermissionCheck('action');
    const { setModalHandler, closeModal, setValue } = useStore();
    const [loadingAction, setLoadingAction] = useState(false);
    const [showRecordDialog, setShowRecordDialog] = useState(false);
    const [recordData, setRecordData] = useState(null);
    const [type, setType] = useState(1);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editData, setEditData] = useState(null);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const { isLoading: loading, data: listData, mutate, updatedDate } = useObserves({ type });

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
        <div className='Observe'>
            <div className='dashboard-header'>
                <div className='header-left'>
                    <div className='title'>動能清單</div>
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
                    <Button className='act' disabled={loadingAction || !actionPermission} variant='contained' color='warning' startIcon={<AddCircleOutline />} onClick={addHandler}>
                        新增
                    </Button>
                </div>
                <div className='date'>
                    <ToggleButtonGroup color='primary' value={type} exclusive onChange={handleTypeChange} aria-label='Platform'>
                        <ToggleButton disabled={loading} variant={'contained'} color={'primary'} value={1}>
                            觀察
                        </ToggleButton>
                        <ToggleButton disabled={loading} variant={'contained'} color={'primary'} value={2}>
                            稍微觀察
                        </ToggleButton>
                        <ToggleButton disabled={loading} variant={'contained'} color={'primary'} value={3}>
                            其他
                        </ToggleButton>
                        <ToggleButton disabled={loading} variant={'contained'} color={'primary'} value={4}>
                            全部
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
            </div>
            <div className='container'>
                <div className='table-wrapper'>
                    <DataGrid
                        className='table-root'
                        ref={dashboardRef}
                        rows={loading ? [] : listData || []}
                        getRowId={(row) => row.id}
                        columns={listColumn(showRecord, deleteHandler, editHandler, actionPermission)}
                        loading={loading}
                        disableSelectionOnClick
                        componentsProps={{
                            pagination: {
                                labelRowsPerPage: '每頁筆數:',
                            },
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
