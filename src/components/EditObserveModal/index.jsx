import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import './styles.scss';
import { useSnackbar } from 'notistack';
import ConfirmButton from '@/components/ConfirmButton';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { editObserve } from '@/services/observe';

const initValid = {
    initPrice: { valid: true, error: '' },
    createdAt: { valid: true, error: '' },
};

export default function EditObserveModal(props) {
    const { open, handleClose, editData } = props;
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [addData, setAddData] = useState({
        initPrice: 0,
        createdAt: '',
    });
    const [validation, setValidation] = useState(initValid);

    const handleChange = (type, e) => {
        setValidation(initValid);
        setAddData((prevState) => ({
            ...prevState,
            [type]: e,
        }));
    };

    useEffect(() => {
        if (open) {
            setValidation(initValid);
            setAddData({
                initPrice: editData?.initPrice,
                createdAt: dayjs(editData?.createdAt),
            });
        }
    }, [editData?.createdAt, editData?.initPrice, open]);

    const handlerOk = async () => {
        let data = {
            id: editData.id,
            initPrice: +addData.initPrice,
            createdAt: addData.createdAt,
        };
        if (!data.initPrice || !data.createdAt) {
            setValidation((prevState) => ({
                ...prevState,
                initPrice: {
                    valid: !!data.initPrice,
                    error: !data.initPrice ? '此欄位必填' : '',
                },
                createdAt: {
                    valid: !!data.createdAt,
                    error: !data.createdAt ? '此欄位必填' : '',
                },
            }));
            return;
        }
        setValidation(initValid);
        setLoading(true);
        try {
            let result = await editObserve(data);
            const { success, message } = result;
            if (success) {
                enqueueSnackbar('更新成功', { variant: 'success' });
                handleClose(true);
                setLoading(false);
            } else {
                enqueueSnackbar(message, { variant: 'error' });
                setLoading(false);
            }
        } catch (err) {
            enqueueSnackbar('更新失敗', { variant: 'error' });
            setLoading(false);
        }
    };

    return (
        <Dialog className='editDialog EditObserveModal' open={open} onClose={() => (loading ? () => {} : handleClose())}>
            <DialogTitle>
                <span className='title-text'>{'編輯觀察目標'}</span>
            </DialogTitle>
            <DialogContent>
                <div className='stock-set'>
                    <div className='stock-name-code'>
                        <div className='stock-name'>{editData?.name}</div> <div className='stock-code'>{editData?.code}</div>
                    </div>
                    <div className='stock-price'>{editData?.price}</div>
                </div>
                <TextField
                    margin='dense'
                    required
                    label={'初始價格'}
                    type='number'
                    size='small'
                    disabled={loading}
                    error={!validation.initPrice.valid}
                    helperText={validation.initPrice.error}
                    value={addData.initPrice}
                    fullWidth
                    onChange={(e) => {
                        handleChange('initPrice', e.target.value);
                    }}
                />
                <DatePicker
                    label='觀察日期'
                    value={addData.createdAt}
                    maxDate={dayjs()}
                    onChange={(e) => {
                        handleChange('createdAt', e);
                    }}
                />
                <div className='mt-2 mb-2' />
            </DialogContent>
            <DialogActions>
                <ConfirmButton variant='contained' onClick={handlerOk} loading={loading} text={'確認'} />
                <Button disabled={loading} onClick={() => handleClose()}>
                    取消
                </Button>
            </DialogActions>
        </Dialog>
    );
}
