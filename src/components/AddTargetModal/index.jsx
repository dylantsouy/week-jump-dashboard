import { Box, Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { useEffect, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import './styles.scss';
import { useSnackbar } from 'notistack';
import ConfirmButton from '@/components/ConfirmButton';
import { addTarget } from '@/services/targetApi';
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
import { useStore } from '@/stores/store';

const initValid = {
    stockCode: { valid: true, error: '' },
    rate: { valid: true, error: '' },
    initPrice: { valid: true, error: '' },
    createdAt: { valid: true, error: '' },
    sort: { valid: true, error: '' },
    averagePE: { valid: true, error: '' },
    CAGR: { valid: true, error: '' },
    deadline: { valid: true, error: '' },
};

const initValue = {
    rate: 5,
    initPrice: '',
    createdAt: dayjs(),
    sort: '',
    averagePE: '',
    CAGR: '',
    deadline: '',
    stockCode: null,
};

export default function AddTargetModal(props) {
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

    const [loading, setLoading] = useState(false);
    const [addData, setAddData] = useState(initValue);
    const [validation, setValidation] = useState(initValid);

    const stockOptions = codeLists || [];
    const isCodeListsLoading = codeListsLoading && (!codeLists || codeLists.length === 0);

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
            stockCode: String(addData.stockCode),
            rate: addData.rate,
            initPrice: +addData.initPrice,
            createdAt: addData.createdAt,
            sort: addData.sort,
            averagePE: addData.averagePE.trim(),
            CAGR: addData.CAGR.trim(),
            deadline: addData.deadline.trim(),
        };
        if (!data.stockCode || !data.rate || !data.initPrice || !data.createdAt || !data.sort) {
            setValidation((prevState) => ({
                ...prevState,
                stockCode: {
                    valid: !!data.stockCode,
                    error: !data.stockCode ? '此欄位必填' : '',
                },
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
            let result = await addTarget(data);
            const { success } = result;
            if (success) {
                enqueueSnackbar('新增成功', { variant: 'success' });
                handleClose(true);
                setLoading(false);
            }
        } catch (err) {
            if (err.message === 'Target with the same stockCode already exists') {
                enqueueSnackbar('此目標已存在', { variant: 'error' });
            } else {
                enqueueSnackbar('新增失敗', { variant: 'error' });
            }
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
                            onChange={(event, value) => handleChange('stockCode', value ? +value.code : null)}
                            renderInput={(params) => <TextField {...params} required error={!validation.stockCode.valid} helperText={validation.stockCode.error} label='代碼' />}
                        />
                        <TextField
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
                            label={'題材'}
                            type='text'
                            size='small'
                            disabled={loading}
                            error={!validation.deadline.valid}
                            helperText={validation.deadline.error}
                            value={addData.deadline}
                            fullWidth
                            onChange={(e) => {
                                handleChange('deadline', e.target.value);
                            }}
                        />
                        <TextField
                            margin='dense'
                            label={'歷史 PE'}
                            type='text'
                            size='small'
                            disabled={loading}
                            error={!validation.averagePE.valid}
                            helperText={validation.averagePE.error}
                            value={addData.averagePE}
                            fullWidth
                            onChange={(e) => {
                                handleChange('averagePE', e.target.value);
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
