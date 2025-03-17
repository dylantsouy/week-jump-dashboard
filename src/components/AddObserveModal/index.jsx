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
import { useStore } from '@/stores/store';

const initValid = {
    stockCode: { valid: true, error: '' },
    price: { valid: true, error: '' },
    date: { valid: true, error: '' },
};

const reasonOptions = {
    1: ['列入觀察', '等待資金'],
    2: ['偏多整理', '帶量發動'],
    3: ['行情噴發', '過熱注意'],
};
export default function AddObserveModal(props) {
    const { open, handleClose } = props;
    const { enqueueSnackbar } = useSnackbar();
    const { codeLists, setValue } = useStore();
    const [skipFetch, setSkipFetch] = useState(false);
    // Check if we already have codeLists in the store
    useEffect(() => {
        if (open && codeLists && codeLists.length > 0) {
            setSkipFetch(true);
        } else if (open) {
            setSkipFetch(false);
        }
    }, [open, codeLists]);

    // Only fetch when open and we don't have data already
    const { isLoading: codeListsLoading, data } = useCodeLists({
        open: open && !skipFetch,
    });
    // Update store with fetched data if needed
    useEffect(() => {
        if (data && !skipFetch && (!codeLists || codeLists.length === 0)) {
            setValue('codeLists', data);
        }
    }, [data, skipFetch, setValue, codeLists]);
    const stockOptions = codeLists || [];
    const isCodeListsLoading = codeListsLoading && (!codeLists || codeLists.length === 0);
    const [loading, setLoading] = useState(false);
    const [addData, setAddData] = useState({
        price: '',
        reason: '列入觀察',
        date: dayjs(),
        stockCode: null,
        type: 1,
    });
    const [validation, setValidation] = useState(initValid);

    const handleChange = (key, value) => {
        setAddData((prevState) => ({
            ...prevState,
            [key]: value,
            ...(key === 'type' ? { reason: reasonOptions[value]?.[0] || '' } : {}), // 預設選第一個 reason
        }));
        setValidation(initValid);
    };

    const handleChangeStockCode = (value) => {
        setAddData((prevState) => ({
            ...prevState,
            stockCode: value?.code,
            price: value?.price,
        }));
        setValidation(initValid);
    };

    useEffect(() => {
        if (open) {
            setAddData((prevState) => ({
                ...prevState,
                price: '',
                stockCode: null,
            }));
        }
    }, [open]);

    const handlerOk = async () => {
        let data = {
            stockCode: String(addData.stockCode),
            price: +addData.price,
            date: addData.date,
            type: addData.type,
            reason: addData.reason,
        };
        if (!data.stockCode || !data.price || !data.date || !data.reason) {
            setValidation(() => ({
                stockCode: {
                    valid: !!data.stockCode,
                    error: !data.stockCode ? '此欄位必填' : '',
                },
                price: {
                    valid: !!data.price,
                    error: !data.price ? '此欄位必填' : '',
                },
                reason: {
                    valid: !!data.reason,
                    error: !data.reason ? '此欄位必填' : '',
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

    const filterOptions = (options, { inputValue }) => {
        const filterValue = inputValue.toLowerCase();
        return options.filter((option) => option.code.toLowerCase().includes(filterValue) || option.name.toLowerCase().includes(filterValue));
    };
    return (
        <Dialog className='editDialog EditTargetModal' open={open} onClose={() => (loading ? () => {} : handleClose())}>
            <DialogTitle>
                <span className='title-text'>{'新增觀察目標'}</span>
            </DialogTitle>
            <DialogContent>
                {!stockOptions.length && !isCodeListsLoading ? (
                    <div className='nodata'>
                        <NoData text='請先獲取股票清單' />
                    </div>
                ) : (
                    <>
                        <FormControl sx={{ minWidth: 120 }} size='small' required>
                            <InputLabel id='category-label'>類別</InputLabel>
                            <Select labelId='category-label' id='category' value={addData.type} label='類別' onChange={(e) => handleChange('type', e.target.value)}>
                                <MenuItem value={1}>冷水</MenuItem>
                                <MenuItem value={2}>溫水</MenuItem>
                                <MenuItem value={3}>熱水</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl sx={{ minWidth: 120 }} size='small' required>
                            <InputLabel id='level-label'>位階</InputLabel>
                            <Select labelId='level-label' id='level' value={addData.reason} label='位階' onChange={(e) => handleChange('reason', e.target.value)}>
                                {(reasonOptions[addData.type] || []).map((item) => (
                                    <MenuItem key={item} value={item}>
                                        {item}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Autocomplete
                            disabled={isCodeListsLoading}
                            disablePortal
                            id='stockCode-lists'
                            size='small'
                            options={stockOptions}
                            getOptionLabel={(option) => option.code}
                            filterOptions={filterOptions}
                            renderOption={(props, option) => (
                                <Box component='li' sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                    {option.name} ({option.code})
                                </Box>
                            )}
                            onChange={(event, value) => handleChangeStockCode(value ? value : null)}
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
                {stockOptions.length ? <ConfirmButton variant='contained' onClick={handlerOk} loading={loading} text={'確認'} /> : ''}
                <Button disabled={loading} onClick={() => handleClose()}>
                    取消
                </Button>
            </DialogActions>
        </Dialog>
    );
}
