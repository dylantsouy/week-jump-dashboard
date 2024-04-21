import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import './styles.scss';
import { useSnackbar } from 'notistack';
import ConfirmButton from '@/components/ConfirmButton';
import { editTarget } from '@/services/targetApi';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const initValid = {
    rate: { valid: true, error: '' },
    initPrice: { valid: true, error: '' },
    createdAt: { valid: true, error: '' },
    sort: { valid: true, error: '' },
    yield: { valid: true, error: '' },
    avergePE: { valid: true, error: '' },
    CAGR: { valid: true, error: '' },
};

export default function EditTargetModal(props) {
    const { open, handleClose, editData } = props;
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [addData, setAddData] = useState({
        rate: 1,
        initPrice: 0,
        createdAt: '',
        sort: 0,
        yield: '',
        avergePE: '',
        CAGR: '',
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
                rate: editData?.rate,
                initPrice: editData?.initPrice,
                createdAt: dayjs(editData?.createdAt),
                sort: editData?.sort,
                yield: editData?.yield,
                avergePE: editData?.avergePE,
                CAGR: editData?.CAGR,
            });
        }
    }, [editData?.CAGR, editData?.avergePE, editData?.createdAt, editData?.initPrice, editData?.rate, editData?.sort, editData?.yield, open]);

    const handlerOk = async () => {
        let data = {
            id: editData.id,
            rate: addData.rate,
            initPrice: +addData.initPrice,
            createdAt: addData.createdAt,
            sort: addData.sort,
            yield: addData.yield.trim(),
            avergePE: addData.avergePE.trim(),
            CAGR: addData.CAGR.trim(),
        };
        if (!data.rate || !data.initPrice || !data.createdAt || !data.sort) {
            setValidation((prevState) => ({
                ...prevState,
                rate: {
                    valid: !!data.rate,
                    error: !data.rate ? '此欄位必填' : '',
                },
                initPrice: {
                    valid: !!data.initPrice,
                    error: !data.initPrice ? '此欄位必填' : '',
                },
                createdAt: {
                    valid: !!data.createdAt,
                    error: !data.createdAt ? '此欄位必填' : '',
                },
                sort: {
                    valid: !!data.sort,
                    error: !data.sort ? '此欄位必填' : '',
                },
            }));
            return;
        }
        setValidation(initValid);
        setLoading(true);
        try {
            let result = await editTarget(data);
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
        <Dialog className='editDialog EditTargetModal' open={open} onClose={() => (loading ? () => {} : handleClose())}>
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
                    autoFocus
                    margin='dense'
                    required
                    label={'排序'}
                    type='number'
                    size='small'
                    disabled={loading}
                    error={!validation.sort.valid}
                    helperText={validation.sort.error}
                    value={addData.sort}
                    fullWidth
                    onChange={(e) => {
                        handleChange('sort', e.target.value);
                    }}
                />
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

                <FormControl sx={{ m: 1, minWidth: 120 }} size='small' required>
                    <InputLabel id='rate-label'>評等</InputLabel>
                    <Select labelId='rate' id='rate' value={addData.rate} label='評等' onChange={(e) => handleChange('rate', e.target.value)}>
                        <MenuItem value={1}>持有</MenuItem>
                        <MenuItem value={2}>看好</MenuItem>
                        <MenuItem value={3}>有機會</MenuItem>
                        <MenuItem value={4}>需等待</MenuItem>
                        <MenuItem value={5}>待觀察</MenuItem>
                        <MenuItem value={6}>中立</MenuItem>
                        <MenuItem value={7}>已反應</MenuItem>
                        <MenuItem value={8}>有風險</MenuItem>
                        <MenuItem value={9}>中立偏空</MenuItem>
                        <MenuItem value={10}>不看好</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    margin='dense'
                    label={'CAGR'}
                    type='text'
                    size='small'
                    disabled={loading}
                    error={!validation.CAGR.valid}
                    helperText={validation.CAGR.error}
                    value={addData.CAGR}
                    fullWidth
                    onChange={(e) => {
                        handleChange('CAGR', e.target.value);
                    }}
                />
                <TextField
                    margin='dense'
                    label={'平均殖利率'}
                    type='text'
                    size='small'
                    disabled={loading}
                    error={!validation.yield.valid}
                    helperText={validation.yield.error}
                    value={addData.yield}
                    fullWidth
                    onChange={(e) => {
                        handleChange('yield', e.target.value);
                    }}
                />
                <TextField
                    margin='dense'
                    label={'平均 PE'}
                    type='text'
                    size='small'
                    disabled={loading}
                    error={!validation.avergePE.valid}
                    helperText={validation.avergePE.error}
                    value={addData.avergePE}
                    fullWidth
                    onChange={(e) => {
                        handleChange('avergePE', e.target.value);
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
