import { Box, Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { useEffect, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import './styles.scss';
import { useSnackbar } from 'notistack';
import ConfirmButton from '@/components/ConfirmButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import useCodeLists from '@/services/useCodeLists';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import NoData from '../NoData';
import { addObserve } from '@/services/observe';

const initValid = {
    stockCode: { valid: true, error: '' },
    price: { valid: true, error: '' },
    date: { valid: true, error: '' },
};

const initValue = {
    price: '',
    reason: '',
    date: dayjs(),
    stockCode: null,
    type: 1,
};

export default function AddObserveModal(props) {
    const { open, handleClose } = props;
    const { enqueueSnackbar } = useSnackbar();
    const { isLoading: codeListsLoading, data: codeLists } = useCodeLists({ open });
    const [loading, setLoading] = useState(false);
    const [addData, setAddData] = useState(initValue);
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
            setAddData(initValue);
        }
    }, [open]);

    const handlerOk = async () => {
        let data = {
            stockCode: addData.stockCode,
            price: +addData.price,
            date: addData.date,
            type: addData.type,
            reason: addData.reason,
        };
        if (!data.stockCode || !data.price || !data.date) {
            setValidation(() => ({
                stockCode: {
                    valid: !!data.stockCode,
                    error: !data.stockCode ? '此欄位必填' : '',
                },
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
            let result = await addObserve(data);
            const { success } = result;
            if (success) {
                enqueueSnackbar('新增成功', { variant: 'success' });
                handleClose(true);
                setLoading(false);
            }
        } catch (err) {
            enqueueSnackbar('新增失敗', { variant: 'error' });
            setLoading(false);
        }
    };

    return (
        <Dialog className='editDialog EditTargetModal' open={open} onClose={() => (loading ? () => {} : handleClose())}>
            <DialogTitle>
                <span className='title-text'>{'新增觀察目標'}</span>
            </DialogTitle>
            <DialogContent>
                {!codeLists?.length ? (
                    <div className='nodata'>
                        <NoData text='請先獲取股票清單' />
                    </div>
                ) : (
                    <>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size='small' required>
                            <InputLabel id='type-label'>類別</InputLabel>
                            <Select labelId='type-label' id='type' value={addData.type} label='類別' onChange={(e) => handleChange('type', e.target.value)}>
                                <MenuItem value={1}>觀察</MenuItem>
                                <MenuItem value={2}>稍微觀察</MenuItem>
                                <MenuItem value={3}>其他</MenuItem>
                            </Select>
                        </FormControl>
                        <Autocomplete
                            disabled={codeListsLoading}
                            disablePortal
                            id='stockCode-lists'
                            size='small'
                            options={codeLists}
                            getOptionLabel={(option) => option.code}
                            renderOption={(props, option) => (
                                <Box component='li' sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                    {option.name} ({option.code})
                                </Box>
                            )}
                            onChange={(event, value) => handleChange('stockCode', value ? +value.code : null)}
                            renderInput={(params) => <TextField {...params} required error={!validation.stockCode.valid} helperText={validation.stockCode.error} label='代碼' />}
                        />
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
                            label={'原因'}
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
                    </>
                )}
                <div className='mt-2 mb-2' />
            </DialogContent>
            <DialogActions>
                {codeLists?.length ? <ConfirmButton variant='contained' onClick={handlerOk} loading={loading} text={'確認'} /> : ''}
                <Button disabled={loading} onClick={() => handleClose()}>
                    取消
                </Button>
            </DialogActions>
        </Dialog>
    );
}
