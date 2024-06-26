import Button from '@mui/material/Button';
import './styles.scss';
import ConfirmButton from '../ConfirmButton';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import { useStore } from '@/stores/store';

export default function ConfirmModal() {
    const { showModal, modalHandler, modalText, noModalBtn, modalLoading, closeModal } = useStore();

    const handleClose = () => {
        closeModal();
    };
    const handlerOk = () => {
        modalHandler();
    };

    return (
        <Modal
            className='confirmModal-wrapper'
            open={showModal}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotprops={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={showModal}>
                <div className='container'>
                    <div className='content'>{modalText}</div>
                    {!noModalBtn && (
                        <div className='footer'>
                            <ConfirmButton loading={modalLoading} variant='contained' onClick={handlerOk} text={"確認"} />
                            <Button onClick={() => handleClose()} role='cancelButton'>
                                取消
                            </Button>
                        </div>
                    )}
                </div>
            </Fade>
        </Modal>
    );
}
