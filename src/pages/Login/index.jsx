import { useState } from 'react';
import './index.scss';
import { login } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import titleLogo from '@/assets/icons/logo.svg';
import { Checkbox, FormControlLabel, InputAdornment, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import PasswordInput from '@/components/PasswordInput';
import ConfirmButton from '@/components/ConfirmButton';
import { Account } from '@/assets/icons';
import { permissionHandler } from '@/helpers/permission';

function LoginPage() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { setAuthValue, rememberAccount, ifRememberAccount } = useAuthStore();
    const [email, setEmail] = useState(rememberAccount);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [validation, setValidation] = useState({
        account: { valid: true, error: '' },
        password: { valid: true, error: '' },
    });

    const handleRememberAccountChange = (e) => {
        setAuthValue('ifRememberAccount', e.target.checked);
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setValidation({
            account: { valid: true, error: '' },
            password: { valid: true, error: '' },
        });
        if (id === 'password') {
            setPassword(value);
        } else {
            setEmail(value);
        }
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();

        if (!email || !password) {
            setValidation({
                account: {
                    valid: !!email,
                    error: !email ? '此欄位必填' : '',
                },
                password: {
                    valid: !!password,
                    error: !password ? '此欄位必填' : '',
                },
            });
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const result = await login({ email, password });
            if (result?.success) {
                setAuthValue('user', result?.data);
                setAuthValue('permissionArray', permissionHandler(result?.data?.role));
                setAuthValue('token', result?.token);
                setAuthValue('rememberAccount', email);
                navigate('/dashboard');
            } else {
                enqueueSnackbar('請求發生錯誤, 請重新嘗試', { variant: 'error' });
            }
            setLoading(false);
        } catch (error) {
            if (error?.message === 'Email Error' || error?.message === 'Invalid Password') {
                enqueueSnackbar('帳號或密碼錯誤, 請重新嘗試', { variant: 'error' });
            } else {
                enqueueSnackbar('請求發生錯誤, 請重新嘗試', { variant: 'error' });
            }
            setLoading(false);
        }
    };

    return (
        <div className='LoginPage'>
            <div className='left'>
                <img src={titleLogo} className='logo' alt='SWeek Jump Dashboard Logo' />
                <div className='ball ball1' />
                <div className='ball ball2' />
                <div className='ball ball3' />
                <div className='ball ball4' />
                <div className='ball ball5' />
                <div className='ball ball6' />
                <div className='ball ball7' />
                <div className='line line1' />
                <div className='line line2' />
                <div className='line line3' />
                <div className='line line4' />
            </div>
            <div className='right'>
                <form>
                    <div className='title'>Welcome Back</div>
                    <div className='input-field'>
                        <TextField
                            id='account'
                            label='帳號'
                            placeholder='請輸入 E-mail 帳號'
                            variant='standard'
                            value={email}
                            onChange={handleChange}
                            error={!validation.account.valid}
                            helperText={validation.account.error}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <Account />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    <div className='input-field'>
                        <PasswordInput
                            label='密碼'
                            variant='standard'
                            handleKeyDown={handleKeyDown}
                            onChange={handleChange}
                            placeholder='請輸入 6 - 12 字元'
                            error={!validation.password.valid}
                            helperText={validation.password.error}
                        />
                    </div>
                    <div className='save-account'>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={ifRememberAccount}
                                    size='small'
                                    onChange={handleRememberAccountChange}
                                    sx={{
                                        color: '#aaa',
                                    }}
                                />
                            }
                            label='記住帳號'
                        />
                    </div>
                    <ConfirmButton variant='contained' onClick={handleSubmit} loading={loading} text={'登入'} />
                    <div className='version'>v{process.env.VITE_APP_VERSION}</div>
                </form>
                <div className='rwd'>
                    <div className='save-account'>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={ifRememberAccount}
                                    size='small'
                                    onChange={handleRememberAccountChange}
                                    sx={{
                                        color: '#aaa',
                                    }}
                                />
                            }
                            label='記住帳號'
                        />
                    </div>
                    <ConfirmButton variant='contained' onClick={handleSubmit} loading={loading} text={'登入'} />
                    <div className='version'>v{process.env.VITE_APP_VERSION}</div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
