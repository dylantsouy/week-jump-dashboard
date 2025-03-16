import { Jump, LogoSM } from '@/assets/icons';
import './index.scss';
import { IconButton, Tooltip } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useStore } from '@/stores/store';
import { useSnackbar } from 'notistack';
import HasPermission from '@/helpers/HasPermission';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CalculateIcon from '@mui/icons-material/Calculate';
import CalculateModal from '../CalculateModal';
import FastSearchModal from '../FastSearchModal';
import { useState } from 'react';
import ScreenSearchDesktopIcon from '@mui/icons-material/ScreenSearchDesktop';

export default function Sidebar() {
    const navigate = useNavigate();
    const { setModalHandler, closeModal } = useStore();
    const { enqueueSnackbar } = useSnackbar();
    const { setAuthValue, ifRememberAccount } = useAuthStore();
    const [showCalculateDialog, setShowCalculateDialog] = useState(false);
    const [showFastSearchDialog, setShowFastSearchDialog] = useState(false);
    const { pathname } = useLocation();

    const sidebarItems = [
        {
            title: '觀察清單',
            router: '/dashboard',
            icon: <AdsClickIcon />,
            permission: 'dashboard',
        },
        {
            title: '跳空清單',
            router: '/jump',
            icon: <Jump />,
            permission: 'jump',
        },
        {
            title: '動能清單',
            router: '/observe',
            icon: <DirectionsRunIcon />,
            permission: 'observe',
        },
        {
            title: '合約清單',
            router: '/contract',
            icon: <ReceiptLongIcon />,
            permission: 'contract',
        },
    ];
    const showCalculateHandler = () => {
        setShowCalculateDialog(true);
    };

    const handleCloseCalculate = () => {
        setShowCalculateDialog(false);
    };

    const showFastSearchHandler = () => {
        setShowFastSearchDialog(true);
    };

    const handleCloseFastSearch = () => {
        setShowFastSearchDialog(false);
    };
    const goHandler = (r) => {
        navigate(r);
    };

    const logoutHandler = () => {
        setModalHandler({
            func: logout,
            text: '您確認要登出嗎?',
        });
    };

    const logout = () => {
        closeModal();
        setAuthValue('token', null);
        setAuthValue('user', null);
        if (!ifRememberAccount) {
            setAuthValue('rememberAccount', '');
        }
        navigate('/login');
        enqueueSnackbar('登出成功', { variant: 'success' });
    };

    return (
        <div className='Sidebar'>
            <div className='logo' data-testid='logo' onClick={() => goHandler('/dashboard')}>
                <LogoSM />
            </div>
            <div className='sidebar-items'>
                {sidebarItems.map((e) => (
                    <HasPermission key={e.router} permission={e.permission}>
                        <Tooltip title={e.title} placement='left'>
                            <div className={`sidebar-item ${pathname?.includes(e.router) && 'active'}`} onClick={() => goHandler(e.router)}>
                                <IconButton color='white'>{e.icon}</IconButton>
                            </div>
                        </Tooltip>
                    </HasPermission>
                ))}
            </div>
            <div className='logout'>
                <Tooltip title='快速查詢' placement='left'>
                    <div className='sidebar-item mb-3' onClick={showFastSearchHandler}>
                        <IconButton color='white'>
                            <ScreenSearchDesktopIcon />
                        </IconButton>
                    </div>
                </Tooltip>
                <Tooltip title='計算工具' placement='left'>
                    <div className='sidebar-item mb-3' onClick={showCalculateHandler}>
                        <IconButton color='white'>
                            <CalculateIcon />
                        </IconButton>
                    </div>
                </Tooltip>
                <Tooltip title='登出' placement='left'>
                    <div className='sidebar-item' onClick={logoutHandler}>
                        <IconButton color='white'>
                            <Logout />
                        </IconButton>
                    </div>
                </Tooltip>
            </div>
            <CalculateModal open={showCalculateDialog} handleClose={handleCloseCalculate} />
            <FastSearchModal open={showFastSearchDialog} handleClose={handleCloseFastSearch} />
        </div>
    );
}
