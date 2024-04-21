import { SnackbarProvider } from 'notistack';
import SnackCloseBtn from '@/components/SnackCloseBtn';

const Snackbar = (props) => {
    const { children } = props;

    return (
        <SnackbarProvider
            autoHideDuration={5000}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            maxSnack={5}
            action={(snackbarKey) => <SnackCloseBtn snackbarKey={snackbarKey}/>}
        >
            {children}
        </SnackbarProvider>
    );
};
export default Snackbar;
