import './index.scss';
import Button from '@mui/material/Button';
import Loading from '../Loading';

export default function ConfirmButton(props) {
    const { loading, color, onClick, text, variant, type, className, disabled } = props;
    return (
        <Button
            className={`confirmButton ${className}`}
            role='confirmButton'
            variant={variant || 'contained'}
            color={color || 'primary'}
            onClick={onClick}
            disabled={loading || disabled}
            type={type}
        >
            {loading ? <Loading color='info' size={25} /> : text}
        </Button>
    );
}
