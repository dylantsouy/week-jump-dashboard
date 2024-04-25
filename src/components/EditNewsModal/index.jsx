import { Box, Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { useEffect, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import './styles.scss';
import { useSnackbar } from 'notistack';
import ConfirmButton from '@/components/ConfirmButton';
import { editNews } from '@/services/newsApi';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Rating from '@mui/material/Rating';
import useNewsNames from '@/services/useNewsNames';
import Autocomplete from '@mui/material/Autocomplete';
import RichEditor from '../RichEditor';

const initValid = {
    status: { valid: true, error: '' },
    sort: { valid: true, error: '' },
    date: { valid: true, error: '' },
    type: { valid: true, error: '' },
    name: { valid: true, error: '' },
    content: { valid: true, error: '' },
    fromWhere: { valid: true, error: '' },
};

export default function EditNewsModal(props) {
    const { open, handleClose, editData, targetId } = props;
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const { isLoading: nameListsLoading, data: nameLists } = useNewsNames({ open, targetId });
    const [addData, setAddData] = useState({
        rate: 1,
        sort: 1,
        status: 1,
        date: dayjs(),
        type: 1,
        name: '',
        content: '',
        fromWhere: '站長',
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
            setAddData(editData);
            setValidation(initValid);
        }
    }, [editData, open]);

    const handlerOk = async () => {
        let data = {
            newsId: editData?.newsId,
            rate: addData.rate,
            sort: addData.sort,
            status: addData.status,
            date: addData.date,
            type: addData.type,
            name: addData.name.trim(),
            fromWhere: addData.fromWhere.trim(),
            content: addData.content.trim(),
        };
        if (!data.status || !data.date || !data.type || !data.sort || !data.name) {
            setValidation((prevState) => ({
                ...prevState,
                name: {
                    valid: !!data.name,
                    error: !data.name ? '此欄位必填' : '',
                },
                sort: {
                    valid: !!data.sort,
                    error: !data.sort ? '此欄位必填' : '',
                },
                status: {
                    valid: !!data.status,
                    error: !data.status ? '此欄位必填' : '',
                },
                date: {
                    valid: !!data.date,
                    error: !data.date ? '此欄位必填' : '',
                },
                type: {
                    valid: !!data.type,
                    error: !data.type ? '此欄位必填' : '',
                },
            }));
            return;
        }
        setValidation(initValid);
        setLoading(true);
        try {
            let result = await editNews(data);
            const { success } = result;
            if (success) {
                enqueueSnackbar('更新成功', { variant: 'success' });
                handleClose(true);
                setLoading(false);
            }
        } catch (err) {
            enqueueSnackbar('更新失敗', { variant: 'error' });
            setLoading(false);
        }
    };

    return (
        <Dialog className='editDialog EditNewsModal' open={open} onClose={() => (loading ? () => {} : handleClose())}>
            <DialogTitle>
                <span className='title-text'>{'編輯消息'}</span>
            </DialogTitle>
            <DialogContent>
                <>
                    <ToggleButtonGroup color='primary' value={addData?.type} exclusive onChange={(e, v) => handleChange('type', v)} aria-label='Platform'>
                        <ToggleButton text='利多' color='warning' value={1}>
                            利多
                        </ToggleButton>
                        <ToggleButton text='利空' color='success' value={2}>
                            利空
                        </ToggleButton>
                        <ToggleButton text='中立' value={3}>
                            中立
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <TextField
                        margin='dense'
                        required
                        label={'排序'}
                        type='number'
                        size='small'
                        disabled={loading}
                        error={!validation.sort.valid}
                        helperText={validation.sort.error}
                        value={addData?.sort}
                        fullWidth
                        onChange={(e) => {
                            handleChange('sort', e.target.value);
                        }}
                    />

                    {nameLists?.length ? (
                        <Autocomplete
                            disabled={nameListsLoading}
                            disablePortal
                            id='stockCode-lists'
                            size='small'
                            freeSolo
                            value={addData.name}
                            options={nameLists}
                            getOptionLabel={(option) => option}
                            renderOption={(props, option) => (
                                <Box component='li' sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                    {option}
                                </Box>
                            )}
                            onChange={(event, value) => handleChange('name', value)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    required
                                    error={!validation.name.valid}
                                    helperText={validation.name.error}
                                    label='分類'
                                    onChange={(event) => handleChange('name', event.target.value)}
                                />
                            )}
                        />
                    ) : (
                        <TextField
                            margin='dense'
                            label={'分類'}
                            type='text'
                            size='small'
                            disabled={loading}
                            error={!validation.name.valid}
                            helperText={validation.name.error}
                            value={addData?.name}
                            fullWidth
                            onChange={(e) => {
                                handleChange('name', e.target.value);
                            }}
                        />
                    )}
                    <TextField
                        margin='dense'
                        label={'來源'}
                        type='text'
                        size='small'
                        disabled={loading}
                        error={!validation.fromWhere.valid}
                        helperText={validation.fromWhere.error}
                        value={addData?.fromWhere}
                        fullWidth
                        onChange={(e) => {
                            handleChange('fromWhere', e.target.value);
                        }}
                    />
                    <DatePicker
                        className='date'
                        label='發佈日期'
                        value={addData?.date}
                        maxDate={dayjs()}
                        onChange={(e) => {
                            handleChange('date', e);
                        }}
                    />
                    <FormControl required>
                        <InputLabel id='status-label'>評等</InputLabel>
                        <Select labelId='status' id='status' value={addData?.status} label='評等' onChange={(e) => handleChange('status', e.target.value)}>
                            <MenuItem value={1}>時間未到</MenuItem>
                            <MenuItem value={2}>提前完成</MenuItem>
                            <MenuItem value={3}>準時完成</MenuItem>
                            <MenuItem value={4}>延後完成</MenuItem>
                            <MenuItem value={5}>延後未完</MenuItem>
                            <MenuItem value={6}>狀況不明</MenuItem>
                            <MenuItem value={7}>悲觀延後</MenuItem>
                            <MenuItem value={8}>樂觀準時</MenuItem>
                            <MenuItem value={9}>無時效性</MenuItem>
                        </Select>
                    </FormControl>
                    <RichEditor data={addData.content} label='內容' type='content' disabled={loading} handleChange={handleChange} />
                    <div className='rate'>
                        重要程度:
                        <Rating name='size-small' value={addData.rate} onChange={(e, r) => handleChange('rate', r)} />
                    </div>
                </>
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
