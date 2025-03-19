import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import './styles.scss';
import Divider from '@mui/material/Divider';
import { useStore } from '@/stores/store';
import { useSnackbar } from 'notistack';
import usePermissionCheck from '@/helpers/usePermissionCheck';
import { listColumn } from '@/helpers/columnsObservesRecord';
import useObservesRecords from '@/services/useObservesRecords';
import { deleteObserveRecord } from '@/services/observe';
import EditObserveRecordModal from '../EditObserveRecordModal';
import DataGrid from '../DataGrid';

export default function ObserveRecordModal(props) {
    const actionPermission = usePermissionCheck('action');
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
                <div className='TablePage datagrid-wrapper'>
                    <div className='datagrid-set'>
                        <DataGrid isLoading={loading} rowData={data} columnDefs={listColumn(deleteHandler, editHandler, actionPermission, recordData)}>
                            <div></div>
                        </DataGrid>
                        <Divider />
                    </div>
                </div>
                <div className='mt-2 mb-2' />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose()}>關閉</Button>
            </DialogActions>
            <EditObserveRecordModal open={showEditDialog} handleClose={handleCloseEdit} editData={editData} />
        </Dialog>
    );
}
