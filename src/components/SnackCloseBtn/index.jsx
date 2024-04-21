import IconButton from '@mui/material/IconButton';
import Close from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';

function SnackCloseBtn(props) {
    const { snackbarKey } = props;
    const { closeSnackbar } = useSnackbar();

    return (
        <IconButton className='close-snackbarBtn' data-testid='close-button' onClick={() => closeSnackbar(snackbarKey)}>
            <Close style={{ color: '#fff' }} />
        </IconButton>
    );
}

export default SnackCloseBtn;
