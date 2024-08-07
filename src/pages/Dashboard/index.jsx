import './index.scss';
import { listColumn } from '@/helpers/columnsTargets';
import { DataGrid } from '@mui/x-data-grid';
import { useRef, useState } from 'react';
import NoResultsOverlay from '@/components/NoResultsOverlay';
import DataGridSkeleton from '@/components/DataGridSkeleton';
import CustomToolbar from '@/components/CustomToolbar';
import { Button, Skeleton } from '@mui/material';
import { generateMeasureTime } from '@/helpers/format';
import useTargets from '@/services/useTargets';
import { AddCircleOutline } from '@mui/icons-material';
import EditTargetModal from '@/components/EditTargetModal';
import AddTargetModal from '@/components/AddTargetModal';
import { useStore } from '@/stores/store';
import { deleteTarget } from '@/services/targetApi';
import { createStock } from '@/services/stockApi';
import { useSnackbar } from 'notistack';
import EditEpsModal from '@/components/EditEpsModal';
import NewsModal from '@/components/NewsModal';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import usePermissionCheck from '@/helpers/usePermissionCheck';
import { localeText } from '@/helpers/datagridHelper';

function Dashboard() {
    const dashboardRef = useRef(null);
    const actionPermission = usePermissionCheck('action');
    const { setModalHandler, closeModal, setValue } = useStore();
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);
    const [showEpsDialog, setShowEpsDialog] = useState(false);
    const [showNewsDialog, setShowNewsDialog] = useState(false);
    const [editData, setEditData] = useState(null);
    const [epsData, setEpsData] = useState(null);
    const [newsData, setNewsData] = useState(null);
    const { enqueueSnackbar } = useSnackbar();

    const { isLoading: loading, data: listData, mutate, updatedDate } = useTargets();

    const editHandler = (e) => {
        setEditData(e);
        setShowEditDialog(true);
    };

    const epsHandler = (e) => {
        setEpsData(e);
        setShowEpsDialog(true);
    };

    const newsHandler = (e) => {
        setNewsData(e);
        setShowNewsDialog(true);
    };

    const handleCloseEps = (refresh) => {
        setShowEpsDialog(false);
        if (refresh) {
            mutate();
        }
    };
    const addHandler = () => {
        setShowAddDialog(true);
    };

    const handleCloseNews = () => {
        setShowNewsDialog(false);
    };

    const handleCloseAdd = (refresh) => {
        setShowAddDialog(false);
        if (refresh) {
            mutate();
        }
    };

    const handleCloseEdit = (refresh) => {
        setShowEditDialog(false);
        if (refresh) {
            mutate();
        }
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
            let result = await deleteTarget(e?.id);
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

    const deleteHandler = (e) => {
        setModalHandler({
            func: () => confirmDelete(e),
            text: (
                <div className='delete-content'>
                    <div className='delete-title'>
                        <div className='stock-set'>
                            <div className='stock-name-code'>
                                <div className='stock-name'>{'請確認是否刪除'}:</div>
                                <div className='stock-code'>
                                    {e?.name} {e?.code}
                                </div>
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
            <div className='title-switch'>
                <Button disabled={loadingAction || !actionPermission} variant='contained' color='warning' startIcon={<AddCircleOutline />} onClick={addHandler}>
                    新增
                </Button>
                <Button disabled={loadingAction || !actionPermission} className='ml-2' variant='contained' startIcon={<CloudSyncIcon />} onClick={refreshHandler}>
                    更新收盤價
                </Button>
            </div>
            <div className='container'>
                <div className='table-wrapper'>
                    <DataGrid
                        className='table-root'
                        ref={dashboardRef}
                        rows={loading ? [] : listData || []}
                        getRowId={(row) => row.id}
                        columns={listColumn(editHandler, deleteHandler, epsHandler, newsHandler, actionPermission)}
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
                                sortModel: [{ field: 'sort', sort: 'asc' }],
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
            <AddTargetModal open={showAddDialog} handleClose={handleCloseAdd} />
            <EditTargetModal open={showEditDialog} handleClose={handleCloseEdit} editData={editData} />
            <EditEpsModal actionPermission={actionPermission} open={showEpsDialog} handleClose={handleCloseEps} epsData={epsData} />
            <NewsModal actionPermission={actionPermission} open={showNewsDialog} handleClose={handleCloseNews} targetData={newsData} />
        </div>
    );
}

export default Dashboard;
