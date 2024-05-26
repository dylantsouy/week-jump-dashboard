import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { useRef, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import './styles.scss';
import Divider from '@mui/material/Divider';
import { useStore } from '@/stores/store';
import { useSnackbar } from 'notistack';
import ModalSkeleton from '../ModalSkeleton';
import DataGridSkeleton from '../DataGridSkeleton';
import { DataGrid } from '@mui/x-data-grid';
import usePermissionCheck from '@/helpers/usePermissionCheck';
import { listColumn } from '@/helpers/columnsObservesRecord';
import NoResultsText from '../NoResultsText';
import useObservesRecords from '@/services/useObservesRecords';
import { deleteObserveRecord } from '@/services/observe';
import EditObserveRecordModal from '../EditObserveRecordModal';

export default function ObserveRecordModal(props) {
    const actionPermission = usePermissionCheck('action');
    const dashboardRef = useRef(null);
    const { open, handleClose, recordData, mutate } = props;
    const { setModalHandler, closeModal, setValue } = useStore();
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editData, setEditData] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const { isLoading: loading, data, mutate: mutateRecord } = useObservesRecords({ observeId: recordData?.id }, open);

    const editHandler = (e) => {
        setEditData(e);
        setShowEditDialog(true);
    };

    const handleCloseEdit = (refresh) => {
        setShowEditDialog(false);
        if (refresh) {
            mutate();
            mutateRecord();
        }
    };

    const confirmDelete = async (e) => {
        setValue('modalLoading', true);
        try {
            let result = await deleteObserveRecord({ id: e?.id, recordData });
            const { success } = result;
            if (success) {
                enqueueSnackbar('刪除成功', { variant: 'success' });
                handleCloseDelete(true);
                setValue('modalLoading', false);
                mutate();
                mutateRecord();
            }
        } catch (err) {
            enqueueSnackbar('刪除失敗', { variant: 'error' });
            setValue('modalLoading', false);
        }
    };

    const handleCloseDelete = (refresh) => {
        closeModal(false);
        if (refresh) {
            mutate();
            mutateRecord();
        }
    };

    const deleteHandler = (r) => {
        setModalHandler({
            func: () => confirmDelete(r),
            text: (
                <div className='delete-content'>
                    <div className='delete-title'>
                        <div className='stock-set'>
                            <div className='stock-name-code'>
                                <div className='stock-name'>{'請確認是否刪除此觀察紀錄'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        });
    };
    return (
        <Dialog className='editDialog ObserveRecordModal' open={open} onClose={() => handleClose()}>
            <DialogTitle>
                <span className='title-text'>{'觀察明細'}</span>
            </DialogTitle>
            <DialogContent>
                <div className='stock-set'>
                    <div className='stock-name-code'>
                        <div className='stock-name'>{recordData?.name}</div> <div className='stock-code'>{recordData?.code}</div>
                    </div>
                    <div className='stock-price'>{recordData?.price}</div>
                </div>
                {loading ? (
                    <ModalSkeleton />
                ) : (
                    <div className='datagrid-wrapper'>
                        <div className='datagrid-set'>
                            <div className='container'>
                                <div className='table-wrapper'>
                                    <DataGrid
                                        className='table-root'
                                        ref={dashboardRef}
                                        rows={loading ? [] : data || []}
                                        getRowId={(row) => row.id}
                                        columns={listColumn(deleteHandler, editHandler, actionPermission, recordData)}
                                        loading={loading}
                                        disableSelectionOnClick
                                        componentsProps={{
                                            pagination: {
                                                labelRowsPerPage: '每頁筆數:',
                                            },
                                        }}
                                        initialState={{
                                            sorting: {
                                                sortModel: [{ field: 'date', sort: 'desc' }],
                                            },
                                        }}
                                        density='compact'
                                        sortingOrder={['desc', 'asc']}
                                        components={{
                                            NoRowsOverlay: NoResultsText,
                                            NoResultsOverlay: NoResultsText,
                                            LoadingOverlay: DataGridSkeleton,
                                        }}
                                    />
                                    <Divider />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className='mt-2 mb-2' />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose()}>關閉</Button>
            </DialogActions>
            <EditObserveRecordModal open={showEditDialog} handleClose={handleCloseEdit} editData={editData} />
        </Dialog>
    );
}
