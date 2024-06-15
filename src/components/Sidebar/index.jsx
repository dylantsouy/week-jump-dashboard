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

export default function Sidebar() {
    const navigate = useNavigate();
    const { setModalHandler, closeModal } = useStore();
    const { enqueueSnackbar } = useSnackbar();
    const { setAuthValue, ifRememberAccount } = useAuthStore();
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
                <Tooltip title='登出' placement='left'>
                    <div className='sidebar-item' onClick={logoutHandler}>
                        <IconButton color='white'>
                            <Logout />
                        </IconButton>
                    </div>
                </Tooltip>
            </div>
        </div>
    );
}
