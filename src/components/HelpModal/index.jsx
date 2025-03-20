import Button from '@mui/material/Button';
import './styles.scss';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import { useMediaQuery } from '@mui/material';
import { useState } from 'react';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div role='tabpanel' hidden={value !== index} id={`water-tabpanel-${index}`} aria-labelledby={`water-tab-${index}`} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

// 輔助函數，用於設置 Tabs 的 ARIA 屬性
function a11yProps(index) {
    return {
        id: `water-tab-${index}`,
        'aria-controls': `water-tabpanel-${index}`,
    };
}
export default function HelpModal(props) {
    const { open, handleClose } = props;
    const [modalTabValue, setModalTabValue] = useState(0);

    const handleModalTabChange = (event, newValue) => {
        setModalTabValue(newValue);
    };
    const isSmallScreen = useMediaQuery('(max-width:700px)');

    const closeHandler = () => {
        if (isSmallScreen) {
            return;
        }
        handleClose();
    };

    return (
        <Modal
            className='HelpModal-wrapper'
            open={open}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            onClose={closeHandler}
            slotprops={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={open}>
                <div className='container'>
                    <div className='content'>
                        <div className='help'>
                            <Box sx={{ width: '100%' }}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs value={modalTabValue} onChange={handleModalTabChange} aria-label='water temperature tabs'>
                                        <Tab label='冷水' {...a11yProps(0)} />
                                        <Tab label='溫水' {...a11yProps(1)} />
                                        <Tab label='熱水' {...a11yProps(2)} />
                                    </Tabs>
                                </Box>

                                {/* 冷水內容 */}
                                <TabPanel value={modalTabValue} index={0}>
                                    <div className='help-water'>
                                        <div className='title neutral'>
                                            <div className='sub'>請留意當前階段，適合以周線為操作基準的月內投資人參與。</div>
                                        </div>
                                    </div>

                                    <div className='help-degree'>
                                        <div className='water water1'>
                                            <WaterDropIcon />
                                            0°C - 技術指標轉強，但需要時間整理
                                        </div>
                                        <div className='text'>
                                            技術指標轉強，進入多頭整理階段，目前價量仍處於盤整格局，尚未受到市場資金明顯關注。投資人可進一步研究個股，挖掘其未來潛在題材。{' '}
                                        </div>
                                    </div>

                                    <div className='help-degree'>
                                        <div className='water water2'>
                                            <WaterDropIcon />
                                            10°C - 具備良好基本面，長期價值投資的首選。
                                        </div>
                                        <div className='text'>
                                            個股已有少量資金流入，導致原本的成交均量出現變化，此時可將其納入自選股觀察名單。當市場關注度提升並伴隨放量時，投資人便能更迅速地做出決策。
                                        </div>
                                    </div>
                                </TabPanel>

                                {/* 溫水內容 */}
                                <TabPanel value={modalTabValue} index={1}>
                                    <div className='help-water'>
                                        <div className='title good'>
                                            <div className='sub'>進入決策階段，適合週內投資人參與，以日線為操作基準。</div>
                                        </div>
                                    </div>

                                    <div className='help-degree'>
                                        <div className='water water3'>
                                            <WaterDropIcon />
                                            30°C - 區間整理階段，可逐步布局或逢低加碼
                                        </div>
                                        <div className='text'>技術型態已轉為上升趨勢，且成交量逐步放大，股價可能隨時受到市場關注，有機會突破區間格局，甚至創下波段新高。</div>
                                    </div>

                                    <div className='help-degree'>
                                        <div className='water water4'>
                                            <WaterDropIcon />
                                            50°C - 即將突破，為多方絕佳進場機會
                                        </div>
                                        <div className='text'>個股偏多格局且開始明顯帶量，這時因新高價的關係可能會吸引到更多短線投機客的注意，也會有較多的隔日沖投資人。</div>
                                    </div>
                                </TabPanel>

                                {/* 熱水內容 */}
                                <TabPanel value={modalTabValue} index={2}>
                                    <div className='help-water'>
                                        <div className='title best'>
                                            <div className='sub'>進入進階操作階段，適合日內投資人參與，需盯盤進行交易。</div>
                                        </div>
                                    </div>

                                    <div className='help-degree'>
                                        <div className='water water5'>
                                            <WaterDropIcon />
                                            70°C - 剛突破關鍵位置，抓準時機順勢而為。
                                        </div>
                                        <div className='text'>
                                            價格已突破整理區間，成為當前市場較熱門的標的之一。此時股價波動較大，每日均量受市場當沖資金影響明顯，波段投資人需留意短期追高的風險。
                                        </div>
                                    </div>

                                    <div className='help-degree'>
                                        <div className='water water6'>
                                            <WaterDropIcon />
                                            90°C - 行情已啟動，適合進行短線交易，但需謹慎設置停利。
                                        </div>
                                        <div className='text'>價格已上漲一段時間且市場熱度較高，此階段適合當沖操作或考慮停利退場。</div>
                                    </div>
                                </TabPanel>
                            </Box>
                        </div>
                    </div>
                    <div className='footer'>
                        <Button onClick={() => handleClose()} role='cancelButton'>
                            取消
                        </Button>
                    </div>
                </div>
            </Fade>
        </Modal>
    );
}
