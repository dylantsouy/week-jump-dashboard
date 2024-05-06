import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { useRef } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import './styles.scss';
import NoData from '../NoData';
import Divider from '@mui/material/Divider';
import { useStore } from '@/stores/store';
import { useSnackbar } from 'notistack';
import ModalSkeleton from '../ModalSkeleton';
import { deleteJumpRecord } from '@/services/jumpApi';
import DataGridSkeleton from '../DataGridSkeleton';
import { DataGrid } from '@mui/x-data-grid';
import usePermissionCheck from '@/helpers/usePermissionCheck';
import { listColumn } from '@/helpers/columnsJumpsRecord';
import NoResultsText from '../NoResultsText';

export default function JumpModal(props) {
    const actionPermission = usePermissionCheck('action');
    const dashboardRefm = useRef(null);
    const dashboardRefw = useRef(null);
    const { open, handleClose, recordData, mutate, loading } = props;
    const { setModalHandler, closeModal, setValue } = useStore();
    const { enqueueSnackbar } = useSnackbar();

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

    const content = (data, title, ref) => {
        return (
            <div className='datagrid-set'>
                <div className='jump-title'>
                    <span className='title-text'>{title}</span>
                    <span className='title-count'>{}</span>
                </div>
                <div className='container'>
                    <div className='table-wrapper'>
                        <DataGrid
                            className='table-root'
                            ref={ref}
                            rows={loading ? [] : data || []}
                            getRowId={(row) => row.id}
                            columns={listColumn(deleteHandler, actionPermission, recordData)}
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
                {loading ? (
                    <ModalSkeleton />
                ) : recordData?.JumpsRecords?.length ? (
                    <div className='datagrid-wrapper'>
                        {content(recordData?.m, '月跳', dashboardRefm)}
                        {content(recordData?.w, '周跳', dashboardRefw)}
                    </div>
                ) : (
                    <div className='nodata'>
                        <NoData text='' />
                    </div>
                )}
                <div className='mt-2 mb-2' />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose()}>關閉</Button>
            </DialogActions>
        </Dialog>
    );
}
