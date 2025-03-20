import { Button, Dialog, DialogActions, DialogContent, Tabs, Tab } from '@mui/material';
import { useRef, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import './styles.scss';
import Divider from '@mui/material/Divider';
import { useStore } from '@/stores/store';
import { useSnackbar } from 'notistack';
import { deleteJumpRecord } from '@/services/jumpApi';
import usePermissionCheck from '@/helpers/usePermissionCheck';
import { listColumn } from '@/helpers/columnsJumpsRecord';
import DataGrid from '../DataGrid';

export default function JumpModal(props) {
    const actionPermission = usePermissionCheck('action');
    const dashboardRefm = useRef(null);
    const dashboardRefw = useRef(null);
    const { open, handleClose, recordData, mutate, loading } = props;
    const { setModalHandler, closeModal, setValue } = useStore();
    const { enqueueSnackbar } = useSnackbar();
    const [tabValue, setTabValue] = useState(0);

    const confirmDelete = async (e) => {
        setValue('modalLoading', true);
        try {
            let result = await deleteJumpRecord(e?.id);
            const { success } = result;
            if (success) {
                enqueueSnackbar('刪除成功', { variant: 'success' });
                handleCloseDelete(true);
                setValue('modalLoading', false);
                handleClose(true);
                mutate();
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
                                <div className='stock-name'>{'請確認是否刪除此跳空紀錄'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        });
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const content = (data, title, ref) => {
        return (
            <div className='TablePage datagrid-set'>
                <div className='jump-title'>
                    <span className='title-text'>{title}</span>
                    <span className='title-count'>{data?.length || 0}</span>
                </div>
                <DataGrid isLoading={loading} rowData={data} columnDefs={listColumn(deleteHandler, actionPermission, recordData)} ref={ref}>
                    <div></div>
                </DataGrid>
                <Divider />
            </div>
        );
    };

    return (
        <Dialog className='editDialog JumpModal' open={open} onClose={() => handleClose()}>
            <DialogTitle>
                <span className='title-text'>{'跳空明細'}</span>
            </DialogTitle>
            <DialogContent>
                <div className='stock-set'>
                    <div className='stock-name-code'>
                        <div className='stock-name'>{recordData?.Stock?.name}</div> <div className='stock-code'>{recordData?.Stock?.code}</div>
                    </div>
                    <div className='stock-price'>{recordData?.Stock?.price}</div>
                </div>
                <div className='tab-container'>
                    <Tabs value={tabValue} onChange={handleTabChange} className='jump-tabs'>
                        <Tab label='月跳' />
                        <Tab label='周跳' />
                    </Tabs>
                </div>
                <div className='datagrid-wrapper'>
                    {tabValue === 0 && content(recordData?.m, '月跳', dashboardRefm)}
                    {tabValue === 1 && content(recordData?.w, '周跳', dashboardRefw)}
                </div>
                <div className='mt-2 mb-2' />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose()}>關閉</Button>
            </DialogActions>
        </Dialog>
    );
}
