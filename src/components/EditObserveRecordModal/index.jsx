import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import './styles.scss';
import { useSnackbar } from 'notistack';
import ConfirmButton from '@/components/ConfirmButton';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { editObserveRecord } from '@/services/observe';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const initValid = {
    price: { valid: true, error: '' },
    date: { valid: true, error: '' },
};

export default function EditObserveRecordModal(props) {
    const { open, handleClose, editData } = props;
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [addData, setAddData] = useState({
        price: '',
        reason: '',
        date: dayjs(),
        type: 1,
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
                price: editData?.price,
                reason: editData?.reason,
                date: dayjs(editData?.date),
                type: editData?.type,
            });
        }
    }, [editData?.date, editData?.price, editData?.reason, editData?.type, open]);

    const handlerOk = async () => {
        let data = {
            id: editData.id,
            price: addData?.price,
            reason: addData?.reason,
            date: addData.date,
            type: addData?.type,
        };
        if (!data.price || !data.date) {
            setValidation((prevState) => ({
                ...prevState,
                price: {
                    valid: !!data.price,
                    error: !data.price ? '此欄位必填' : '',
                },
                date: {
                    valid: !!data.date,
                    error: !data.date ? '此欄位必填' : '',
                },
            }));
            return;
        }
        setValidation(initValid);
        setLoading(true);
        try {
            let result = await editObserveRecord(data);
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
                <FormControl sx={{ m: 1, minWidth: 120 }} size='small' required>
                    <InputLabel id='type-label'>類別</InputLabel>
                    <Select labelId='type-label' id='type' value={addData.type} label='類別' onChange={(e) => handleChange('type', e.target.value)}>
                        <MenuItem value={1}>冷水</MenuItem>
                        <MenuItem value={2}>溫水</MenuItem>
                        <MenuItem value={3}>熱水</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    margin='dense'
                    required
                    label={'初始價格'}
                    type='number'
                    size='small'
                    disabled={loading}
                    error={!validation.price.valid}
                    helperText={validation.price.error}
                    value={addData.price}
                    fullWidth
                    onChange={(e) => {
                        handleChange('price', e.target.value);
                    }}
                />
                <TextField
                    margin='dense'
                    label={'理由'}
                    type='text'
                    size='small'
                    disabled={loading}
                    value={addData.reason}
                    fullWidth
                    onChange={(e) => {
                        handleChange('reason', e.target.value);
                    }}
                />
                <DatePicker
                    label='觀察日期'
                    value={addData.date}
                    maxDate={dayjs()}
                    onChange={(e) => {
                        handleChange('date', e);
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
