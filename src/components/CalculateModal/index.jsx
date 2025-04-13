import { Button, Dialog, DialogActions, DialogContent, TextField, useMediaQuery } from '@mui/material';
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
    // 原有可轉債計算的state
    const [stockPrice, setStockPrice] = useState(0);
    const [bondPrice, setBondPrice] = useState(0);
    const [transferPrice, setTransferPrice] = useState(0);

    // 價格變動計算的state
    const [initialPrice, setInitialPrice] = useState(0);
    const [finalPrice, setFinalPrice] = useState(0);

    const [value, setValue] = useState(0);
    const isSmallScreen = useMediaQuery('(max-width:700px)');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // 原有的處理函數
    const handleChangeStockPrice = (e) => {
        setStockPrice(e);
    };
    const handleChangeBondPrice = (e) => {
        setBondPrice(e);
    };
    const handleChangeTransferPrice = (e) => {
        setTransferPrice(e);
    };

    // 價格變動計算的處理函數
    const handleChangeInitialPrice = (e) => {
        setInitialPrice(e);
    };
    const handleChangeFinalPrice = (e) => {
        setFinalPrice(e);
    };

    useEffect(() => {
        if (open) {
            // 重置所有數值
            setStockPrice(0);
            setTransferPrice(0);
            setBondPrice(0);
            setInitialPrice(0);
            setFinalPrice(0);
        }
    }, [open]);

    const closeHandler = () => {
        if (isSmallScreen) {
            return;
        }
        handleClose();
    };

    // 計算價格變動結果
    const calculatePriceDifference = () => {
        if (!initialPrice || !finalPrice) return '-';
        return (finalPrice - initialPrice).toFixed(2);
    };

    const calculatePriceChangePercentage = () => {
        if (!initialPrice || !finalPrice) return '-';
        return (((finalPrice - initialPrice) / initialPrice) * 100).toFixed(2);
    };

    return (
        <Dialog className='editDialog CalculateModal' open={open} onClose={closeHandler}>
            <DialogTitle>
                <span className='title-text'>{'計算工具'}</span>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label='計算工具選項'>
                        <Tab label='幅度計算' {...a11yProps(0)} />
                        <Tab label='可轉債' {...a11yProps(1)} />
                    </Tabs>
                </Box>

                {/* 幅度計算Tab */}
                <CustomTabPanel value={value} index={0}>
                    <div className='flex_center g-10'>
                        <TextField
                            autoFocus
                            margin='dense'
                            label={'初始價格'}
                            type='number'
                            size='small'
                            value={initialPrice}
                            fullWidth
                            onChange={(e) => {
                                handleChangeInitialPrice(e.target.value);
                            }}
                        />
                        <TextField
                            margin='dense'
                            label={'最終價格'}
                            type='number'
                            size='small'
                            value={finalPrice}
                            fullWidth
                            onChange={(e) => {
                                handleChangeFinalPrice(e.target.value);
                            }}
                        />
                    </div>
                    <div className='result'>
                        <div className='item'>
                            <div className='label'>價格變動</div>
                            <div className='value'>{calculatePriceDifference()}</div>
                        </div>
                        <div className='item'>
                            <div className='label'>損益(%)</div>
                            <div className='value'>{calculatePriceChangePercentage()}%</div>
                        </div>
                    </div>
                </CustomTabPanel>

                {/* 原有的可轉債Tab */}
                <CustomTabPanel value={value} index={1}>
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
