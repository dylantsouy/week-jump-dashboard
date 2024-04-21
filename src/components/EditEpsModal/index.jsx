import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import './styles.scss';
import { useSnackbar } from 'notistack';
import ConfirmButton from '@/components/ConfirmButton';
import { editTarget } from '@/services/targetApi';

export default function EditEpsModal(props) {
    const { open, handleClose, epsData, actionPermission } = props;
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [addData, setAddData] = useState({
        id: '',
        eps2023: '',
        eps2024: '',
        revenue2024: '',
        margin2024: '',
        eps2025: '',
        revenue2025: '',
        margin2025: '',
        eps2026: '',
        revenue2026: '',
        margin2026: '',
    });

    const handleChange = (type, e) => {
        setAddData((prevState) => ({
            ...prevState,
            [type]: e,
        }));
    };
    useEffect(() => {
        if (open) {
            setAddData({
                eps2023: epsData?.eps?.eps2023 || '',
                eps2024: epsData?.eps?.eps2024 || '',
                revenue2024: epsData?.eps?.revenue2024 || '',
                margin2024: epsData?.eps?.margin2024 || '',
                eps2025: epsData?.eps?.eps2025 || '',
                revenue2025: epsData?.eps?.revenue2025 || '',
                margin2025: epsData?.eps?.margin2025 || '',
                eps2026: epsData?.eps?.eps2026 || '',
                revenue2026: epsData?.eps?.revenue2026 || '',
                margin2026: epsData?.eps?.margin2026 || '',
                id: epsData?.id,
            });
        }
    }, [
        epsData?.eps?.eps2023,
        epsData?.eps?.eps2024,
        epsData?.eps?.eps2025,
        epsData?.eps?.eps2026,
        epsData?.eps?.margin2024,
        epsData?.eps?.margin2025,
        epsData?.eps?.margin2026,
        epsData?.eps?.revenue2024,
        epsData?.eps?.revenue2025,
        epsData?.eps?.revenue2026,
        epsData?.id,
        open,
    ]);

    const handlerOk = async () => {
        let eps = {
            eps2023: addData?.eps2023,
            eps2024: addData?.eps2024,
            revenue2024: addData?.revenue2024,
            margin2024: addData?.margin2024,
            eps2025: addData?.eps2025,
            revenue2025: addData?.revenue2025,
            margin2025: addData?.margin2025,
            eps2026: addData?.eps2026,
            revenue2026: addData?.revenue2026,
            margin2026: addData?.margin2026,
        };
        let data = {
            id: addData.id,
            eps,
        };
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
                <span className='title-text'>{'編輯 EPS'}</span>
            </DialogTitle>
            <DialogContent>
                <div className='stock-set'>
                    <div className='stock-name-code'>
                        <div className='stock-name'>{epsData?.name}</div> <div className='stock-code'>{epsData?.code}</div>
                    </div>
                    <div className='stock-price'>{epsData?.price}</div>
                </div>
                <div className='flex_center g-10'>
                    <TextField
                        autoFocus
                        margin='dense'
                        label={'2023 EPS'}
                        type='number'
                        size='small'
                        style={{ width: '33.33%' }}
                        disabled={loading || !actionPermission}
                        value={addData.eps2023}
                        fullWidth
                        onChange={(e) => {
                            handleChange('eps2023', e.target.value);
                        }}
                    />
                    <div style={{ width: '33.33%' }}></div>
                    <div style={{ width: '33.33%' }}></div>
                </div>
                <div className='flex_center g-10'>
                    <TextField
                        autoFocus
                        margin='dense'
                        label={'2024 EPS'}
                        type='number'
                        size='small'
                        disabled={loading || !actionPermission}
                        value={addData.eps2024}
                        fullWidth
                        onChange={(e) => {
                            handleChange('eps2024', e.target.value);
                        }}
                    />
                    <TextField
                        autoFocus
                        margin='dense'
                        label={'2024 營收 (億)'}
                        type='text'
                        size='small'
                        disabled={loading || !actionPermission}
                        value={addData.revenue2024}
                        fullWidth
                        onChange={(e) => {
                            handleChange('revenue2024', e.target.value);
                        }}
                    />
                    <TextField
                        autoFocus
                        margin='dense'
                        label={'2024 毛利率 (%)'}
                        type='text'
                        size='small'
                        disabled={loading || !actionPermission}
                        value={addData.margin2024}
                        fullWidth
                        onChange={(e) => {
                            handleChange('margin2024', e.target.value);
                        }}
                    />
                </div>
                <div className='flex_center g-10'>
                    <TextField
                        autoFocus
                        margin='dense'
                        label={'2025 EPS'}
                        type='number'
                        size='small'
                        disabled={loading || !actionPermission}
                        value={addData.eps2025}
                        fullWidth
                        onChange={(e) => {
                            handleChange('eps2025', e.target.value);
                        }}
                    />
                    <TextField
                        autoFocus
                        margin='dense'
                        label={'2025 營收 (億)'}
                        type='text'
                        size='small'
                        disabled={loading || !actionPermission}
                        value={addData.revenue2025}
                        fullWidth
                        onChange={(e) => {
                            handleChange('revenue2025', e.target.value);
                        }}
                    />
                    <TextField
                        autoFocus
                        margin='dense'
                        label={'2025 毛利率 (%)'}
                        type='text'
                        size='small'
                        disabled={loading || !actionPermission}
                        value={addData.margin2025}
                        fullWidth
                        onChange={(e) => {
                            handleChange('margin2025', e.target.value);
                        }}
                    />
                </div>
                <div className='flex_center g-10'>
                    <TextField
                        autoFocus
                        margin='dense'
                        label={'2026 EPS'}
                        type='number'
                        size='small'
                        disabled={loading || !actionPermission}
                        value={addData.eps2026}
                        fullWidth
                        onChange={(e) => {
                            handleChange('eps2026', e.target.value);
                        }}
                    />
                    <TextField
                        autoFocus
                        margin='dense'
                        label={'2026 營收 (億)'}
                        type='text'
                        size='small'
                        disabled={loading || !actionPermission}
                        value={addData.revenue2026}
                        fullWidth
                        onChange={(e) => {
                            handleChange('revenue2026', e.target.value);
                        }}
                    />
                    <TextField
                        autoFocus
                        margin='dense'
                        label={'2026 毛利率 (%)'}
                        type='text'
                        size='small'
                        disabled={loading || !actionPermission}
                        value={addData.margin2026}
                        fullWidth
                        onChange={(e) => {
                            handleChange('margin2026', e.target.value);
                        }}
                    />
                </div>
                <div className='mt-2 mb-2' />
            </DialogContent>
            <DialogActions>
                {actionPermission && <ConfirmButton variant='contained' onClick={handlerOk} loading={loading} text={'確認'} />}
                <Button disabled={loading} onClick={() => handleClose()}>
                    取消
                </Button>
            </DialogActions>
        </Dialog>
    );
}
