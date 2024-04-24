import { Button, Dialog, DialogActions, DialogContent, IconButton } from '@mui/material';
import { useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import './styles.scss';
import { AddCircleOutline, Delete, Edit } from '@mui/icons-material';
import AddNewsModal from '../AddNewsModal';
import useAllNews from '@/services/useAllNews';
import NoData from '../NoData';
import Divider from '@mui/material/Divider';
import moment from 'moment';
import { statusMapping, typeMapping } from '@/helpers/format';
import EditNewsModal from '../EditNewsModal';
import dayjs from 'dayjs';
import Rating from '@mui/material/Rating';
import { useStore } from '@/stores/store';
import { useSnackbar } from 'notistack';
import { deleteNews } from '@/services/newsApi';
import HasPermission from '@/helpers/HasPermission';

export default function NewsModal(props) {
    const { open, handleClose, newsData, actionPermission } = props;
    const { setModalHandler, closeModal, setValue } = useStore();
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [editData, setEditData] = useState();
    const { isLoading: loadingNews, data: listData, mutate } = useAllNews({ targetId: newsData?.id });

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

    const addHandler = () => {
        setShowAddDialog(true);
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
            let result = await deleteNews(e?.newsId);
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
                                <div className='stock-name'>{'請確認是否刪除此消息'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        });
    };

    return (
        <Dialog className='editDialog newsModal' open={open} onClose={() => handleClose()}>
            <DialogTitle>
                <span className='title-text'>{'消息'}</span>
                <Button disabled={loadingNews || !actionPermission} variant='contained' color='warning' startIcon={<AddCircleOutline />} onClick={addHandler}>
                    新增
                </Button>
            </DialogTitle>
            <DialogContent>
                <div className='stock-set'>
                    <div className='stock-name-code'>
                        <div className='stock-name'>{newsData?.name}</div> <div className='stock-code'>{newsData?.code}</div>
                    </div>
                    <div className='stock-price'>{newsData?.price}</div>
                </div>
                {listData?.length ? (
                    <div>
                        {listData?.map((e) => (
                            <div className='news-set' key={e?.name}>
                                <div className='news-title'>{e?.name}</div>
                                {e?.items?.map((r, i) => (
                                    <div className='news-main' key={r?.newsId}>
                                        <div className='news-left'>
                                            <div className='news-index mr-1'>{i + 1}.</div>
                                            <div className='news-content' dangerouslySetInnerHTML={{ __html: r?.content }}></div>
                                        </div>
                                        <div className='news-right'>
                                            <div className='news-date'>
                                                {moment(r?.date).format('YYYY/MM/DD')}
                                                <div className='news-rate'>
                                                    <Rating name='size-small' value={r?.rate} size='small' readOnly />
                                                </div>
                                            </div>
                                            <div className='news-tags'>
                                                <HasPermission permission={'action'}>
                                                    <IconButton aria-label='edit' size='small' onClick={() => editHandler(r, e)}>
                                                        <Edit color='primary' fontSize='inherit' />
                                                    </IconButton>
                                                </HasPermission>
                                                <HasPermission permission={'action'}>
                                                    <IconButton aria-label='edit' size='small' onClick={() => deleteHandler(r)}>
                                                        <Delete color='warning' fontSize='inherit' />
                                                    </IconButton>
                                                </HasPermission>
                                                {r?.fromWhere && <div className='news-badge'>{r?.fromWhere}</div>}
                                                {r?.type && typeMapping(r?.type)}
                                                {r?.status && statusMapping(r?.status)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Divider />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='nodata'>
                        <NoData text='請新增您的第一筆資料' />
                    </div>
                )}
                <div className='mt-2 mb-2' />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose()}>關閉</Button>
            </DialogActions>
            <AddNewsModal targetId={newsData?.id} open={showAddDialog} handleClose={handleCloseAdd} />
            <EditNewsModal open={showEditDialog} handleClose={handleCloseEdit} editData={editData} targetId={newsData?.id} />
        </Dialog>
    );
}
