import './index.scss';
import { listColumn } from '@/helpers/columnsTargets';
import { useState } from 'react';
import { Button, Drawer, IconButton, Skeleton, useMediaQuery } from '@mui/material';
import { generateMeasureTime } from '@/helpers/format';
import useTargets from '@/services/useTargets';
import { AddCircleOutline, TuneRounded } from '@mui/icons-material';
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
import FastSearchModal from '@/components/FastSearchModal';
import DataGrid from '@/components/DataGrid';

function Target() {
    const actionPermission = usePermissionCheck('action');
    const { setModalHandler, closeModal, setValue } = useStore();
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);
    const [showEpsDialog, setShowEpsDialog] = useState(false);
    const [showNewsDialog, setShowNewsDialog] = useState(false);
    const [editData, setEditData] = useState(null);
    const [epsData, setEpsData] = useState(null);
    const [propsStock, setPropsStock] = useState('');
    const [newsData, setNewsData] = useState(null);
    const [showFastSearchDialog, setShowFastSearchDialog] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width:700px)');

    const { isLoading: loading, data: listData, mutate, updatedDate } = useTargets();

    const showFastSearchHandler = (stock) => {
        setPropsStock(stock);
        setShowFastSearchDialog(true);
    };

    const handleCloseFastSearch = () => {
        setShowFastSearchDialog(false);
    };

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
    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <div className='TablePage Target'>
            <div className='title'>
                <div className='title-left'>觀察清單</div>
                <div className='title-right'>
                    收盤價更新: <div className='flex-center'>{loading ? <Skeleton variant='text' width={135} /> : generateMeasureTime(updatedDate)}</div>{' '}
                    <span className='mins'>(每日 14:00 後更新)</span>
                </div>
            </div>
            <div className='title-action mb-2'></div>
            <DataGrid
                select={true}
                isLoading={loading}
                rowData={listData}
                columnDefs={listColumn(editHandler, deleteHandler, epsHandler, newsHandler, actionPermission, showFastSearchHandler)}
            >
                <div>
                    {isSmallScreen ? (
                        <>
                            <Drawer anchor='right' open={drawerOpen} onClose={toggleDrawer}>
                                <div style={{ width: '320px', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <h4 style={{ marginBottom: '8px' }}>操作</h4>
                                    <Button
                                        className='act'
                                        disabled={loadingAction || !actionPermission}
                                        variant='contained'
                                        color='warning'
                                        startIcon={<AddCircleOutline />}
                                        onClick={addHandler}
                                    >
                                        新增
                                    </Button>
                                    <Button disabled={!actionPermission} className='act' variant='contained' startIcon={<CloudSyncIcon />} onClick={refreshHandler}>
                                        更新收盤價
                                    </Button>
                                </div>
                            </Drawer>
                            <IconButton color='primary' onClick={toggleDrawer} style={{ marginLeft: '10px' }}>
                                <TuneRounded />
                            </IconButton>
                        </>
                    ) : (
                        <div>
                            <Button
                                className='act'
                                disabled={loadingAction || !actionPermission}
                                variant='contained'
                                color='warning'
                                startIcon={<AddCircleOutline />}
                                onClick={addHandler}
                            >
                                新增
                            </Button>
                            <Button disabled={!actionPermission} className='act' variant='contained' startIcon={<CloudSyncIcon />} onClick={refreshHandler}>
                                更新收盤價
                            </Button>
                        </div>
                    )}
                </div>
            </DataGrid>
            <AddTargetModal open={showAddDialog} handleClose={handleCloseAdd} listData={listData} />
            <EditTargetModal open={showEditDialog} handleClose={handleCloseEdit} editData={editData} />
            <EditEpsModal actionPermission={actionPermission} open={showEpsDialog} handleClose={handleCloseEps} epsData={epsData} />
            <NewsModal actionPermission={actionPermission} open={showNewsDialog} handleClose={handleCloseNews} targetData={newsData} />
            <FastSearchModal open={showFastSearchDialog} handleClose={handleCloseFastSearch} propsStock={propsStock} />
        </div>
    );
}

export default Target;
