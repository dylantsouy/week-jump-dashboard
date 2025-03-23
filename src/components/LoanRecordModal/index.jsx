import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import './styles.scss';
import Divider from '@mui/material/Divider';
import { listColumn } from '@/helpers/columnsLoansRecord';
import DataGrid from '../DataGrid';

export default function LoanRecordModal(props) {
    const { open, handleClose, recordData } = props;

    return (
        <Dialog className='editDialog LoanRecordModal' open={open} onClose={() => handleClose()}>
            <DialogTitle>
                <span className='title-text'>{'融資增加歷史'}</span>
            </DialogTitle>
            <DialogContent>
                <div className='stock-set'>
                    <div className='stock-name-code'>
                        <div className='stock-name'>{recordData?.stockName}</div> <div className='stock-code'>{recordData?.stockCode}</div>
                    </div>
                    <div className='stock-price'>{recordData?.price}</div>
                </div>
                <div className='TablePage datagrid-wrapper'>
                    <div className='datagrid-set'>
                        <DataGrid rowData={recordData?.records} columnDefs={listColumn()}>
                            <div></div>
                        </DataGrid>
                        <Divider />
                    </div>
                </div>
                <div className='mt-2 mb-2' />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose()}>關閉</Button>
            </DialogActions>
        </Dialog>
    );
}
