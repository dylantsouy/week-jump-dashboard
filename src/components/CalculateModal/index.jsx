import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import './styles.scss';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div role='tabpanel' hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function CalculateModal(props) {
    const { open, handleClose } = props;
    const [stockPrice, setStockPrice] = useState(0);
    const [bondPrice, setBondPrice] = useState(0);
    const [transferPrice, setTransferPrice] = useState(0);
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeStockPrice = (e) => {
        setStockPrice(e);
    };
    const handleChangeBondPrice = (e) => {
        setBondPrice(e);
    };
    const handleChangeTransferPrice = (e) => {
        setTransferPrice(e);
    };

    useEffect(() => {
        if (open) {
            setStockPrice(0);
            setTransferPrice(0);
            setBondPrice(0);
        }
    }, [open]);

    return (
        <Dialog className='editDialog CalculateModal' open={open} onClose={() => handleClose()}>
            <DialogTitle>
                <span className='title-text'>{'計算工具'}</span>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label='可轉債計算'>
                        <Tab label='可轉債' {...a11yProps(0)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <div className='flex_center g-10'>
                        <TextField
                            margin='dense'
                            label={'最新 CB 收盤價'}
                            type='number'
                            size='small'
                            value={bondPrice}
                            fullWidth
                            onChange={(e) => {
                                handleChangeBondPrice(e.target.value);
                            }}
                        />
                        <TextField
                            autoFocus
                            margin='dense'
                            label={'最新股票收盤價'}
                            type='number'
                            size='small'
                            value={stockPrice}
                            fullWidth
                            onChange={(e) => {
                                handleChangeStockPrice(e.target.value);
                            }}
                        />
                        <TextField
                            margin='dense'
                            label={'目前轉換價'}
                            type='number'
                            size='small'
                            value={transferPrice}
                            fullWidth
                            onChange={(e) => {
                                handleChangeTransferPrice(e.target.value);
                            }}
                        />
                    </div>
                    <div className='result'>
                        <div className='item'>
                            <div className='label'>可轉換張數</div>
                            <div className='value'>{transferPrice ? (100 / transferPrice)?.toFixed(2) : '-'}</div>
                        </div>
                        <div className='item'>
                            <div className='label'>對應股價</div>
                            <div className='value'>{transferPrice && bondPrice ? (bondPrice / (100 / transferPrice))?.toFixed(2) : '-'}</div>
                        </div>
                        <div className='item'>
                            <div className='label'>價差</div>
                            <div className='value'>{transferPrice && bondPrice && stockPrice ? (bondPrice / (100 / transferPrice) - stockPrice)?.toFixed(2) : '-'}</div>
                        </div>
                        <div className='item'>
                            <div className='label'>價差(%)</div>
                            <div className='value'>
                                {transferPrice && bondPrice && stockPrice ? (((bondPrice / (100 / transferPrice) - stockPrice) / stockPrice) * 100)?.toFixed(2) : '-'}
                            </div>
                        </div>
                    </div>
                </CustomTabPanel>

                <div className='mt-2 mb-2' />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose()}>取消</Button>
            </DialogActions>
        </Dialog>
    );
}
