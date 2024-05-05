import { Button, Dialog, DialogActions, DialogContent, IconButton } from '@mui/material';
import { useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import './styles.scss';
import { Delete, Edit } from '@mui/icons-material';
import NoData from '../NoData';
import Divider from '@mui/material/Divider';
import moment from 'moment';
import EditJumpModal from '../EditJumpModal';
import dayjs from 'dayjs';
import { useStore } from '@/stores/store';
import { useSnackbar } from 'notistack';
import HasPermission from '@/helpers/HasPermission';
import ModalSkeleton from '../ModalSkeleton';
import { deleteJumpRecord } from '@/services/jumpApi';

export default function JumpModal(props) {
    const { open, handleClose, recordData, mutate, loading } = props;
    const { setModalHandler, closeModal, setValue } = useStore();
    const [showEditDialog, setShowEditDialog] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [editData, setEditData] = useState();

    const handleCloseEdit = (refresh) => {
        setShowEditDialog(false);
        if (refresh) {
            mutate();
        }
    };

    const editHandler = (r, e) => {
        const result = {
            ...r,
            name: e?.name,
            date: dayjs(r?.date),
        };
        setShowEditDialog(true);
        setEditData(result);
    };

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

    const content = (data, title) => {
        return (
            <>
                <div className='jump-title'>
                    <span className='title-text'>{title}</span>
                    <span className='title-count'>{}</span>
                </div>
                {data?.length ? (
                    data?.map((e, i) => (
                        <div className='jump-set' key={e?.id}>
                            <div className='jump-main'>
                                <div className='jump-left'>
                                    <div className='jump-index mr-1'>{i + 1}.</div>
                                    <div className='jump-date mr-1'>{moment(e?.date).format('YYYY/MM/DD')}</div>
                                    <div className='jump-index mr-1'>跳空價: {e?.jumpPrice}</div>
                                    <div className='jump-index mr-1'>缺口低點: {e?.lastPrice}</div>
                                    <div className='jump-index mr-1'>差距: {+(e?.jumpPrice - e?.lastPrice).toFixed(2)}</div>
                                    <div className='jump-index mr-1'>現價: {+recordData?.Stock?.price}</div>
                                    <div className='jump-index mr-1'>
                                        停損: {+(+recordData?.Stock?.price - e?.lastPrice).toFixed(2) > 0 ? +(+recordData?.Stock?.price - e?.lastPrice).toFixed(2) : '-'}
                                    </div>
                                    <div className='jump-index mr-1'>前根量: {e?.lastValue}</div>
                                    <div className='jump-index mr-1'>
                                        是否補上: {e?.closed ? <span className='bad-text bold'>是</span> : <span className='best-text bold'>否</span>}
                                    </div>
                                </div>
                                <div className='jump-right'>
                                    <div className='jump-tags'>
                                        <HasPermission permission={'no'}>
                                            <IconButton aria-label='edit' size='small' onClick={() => editHandler(e)}>
                                                <Edit color='primary' fontSize='inherit' />
                                            </IconButton>
                                        </HasPermission>
                                        <HasPermission permission={'action'}>
                                            <IconButton aria-label='edit' size='small' onClick={() => deleteHandler(e)}>
                                                <Delete color='warning' fontSize='inherit' />
                                            </IconButton>
                                        </HasPermission>
                                    </div>
                                </div>
                            </div>
                            <Divider />
                        </div>
                    ))
                ) : (
                    <div className='nodata'>尚無資料</div>
                )}
            </>
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
                    <div>
                        {content(recordData?.m, '月跳')}
                        {content(recordData?.w, '周跳')}
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
            <EditJumpModal open={showEditDialog} handleClose={handleCloseEdit} editData={editData} />
        </Dialog>
    );
}
