import { useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Password } from '@/assets/icons';

export default function PasswordInput(props) {
    const [showPassword, setShowPassword] = useState(false);
    const { onChange, value, variant, error, helperText, required, disabled, id, label, autoFocus, placeholder, handleKeyDown } = props;
    return (
        <TextField
            margin='dense'
            label={label || 'Password'}
            id={id || 'password'}
            data-testid='password-input'
            type={showPassword ? 'text' : 'password'}
            value={value}
            fullWidth
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            variant={variant || 'standard'}
            onChange={onChange}
            autoFocus={autoFocus}
            onKeyDown={handleKeyDown}
            error={error}
            helperText={helperText}
            InputProps={{
                startAdornment: (
                    <InputAdornment position='start'>
                        <Password />
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position='end'>
                        <IconButton
                            aria-label='toggle password visibility'
                            data-testid='visibility-icon-button'
                            onClick={() => setShowPassword(!showPassword)}
                            onMouseDown={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
}
