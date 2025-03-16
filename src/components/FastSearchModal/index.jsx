import { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, TextField, Box } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import { Link } from 'react-router-dom';
import './styles.scss';
import useCodeLists from '@/services/useCodeLists';
import { useStore } from '@/stores/store';
import { Billion, Dog, Jump } from '@/assets/icons';
import useJump from '@/services/useJump';
import JumpModal from '../JumpModal';
import usePermissionCheck from '@/helpers/usePermissionCheck';
import { useSnackbar } from 'notistack';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import ObserveRecordModal from '../ObserveRecordModal';
import useObserve from '@/services/useObserve';

export default function FastSearchModal(props) {
    const { open, handleClose } = props;
    const { codeLists, setValue } = useStore();
    const { enqueueSnackbar } = useSnackbar();
    const [skipFetch, setSkipFetch] = useState(false);
    const actionPermission = usePermissionCheck('action');
    const [showJumpDialog, setShowJumpDialog] = useState(false);
    const [showJumpData, setShowJumpData] = useState(null);
    const [showRunDialog, setShowRunDialog] = useState(false);
    const [showRunData, setShowRunData] = useState(null);
    const [selectedStock, setSelectedStock] = useState(null);

    // Check if we already have codeLists in the store
    useEffect(() => {
        if (open && codeLists && codeLists.length > 0) {
            setSkipFetch(true);
        } else if (open) {
            setSkipFetch(false);
        }
    }, [open, codeLists]);

    // Only fetch when open and we don't have data already
    const { isLoading: codeListsLoading, data } = useCodeLists({
        open: open && !skipFetch,
        codeLists,
    });

    // Update store with fetched data if needed
    useEffect(() => {
        if (data && !skipFetch && codeLists.length === 0) {
            setValue('codeLists', data);
        }
    }, [data, skipFetch, setValue, codeLists]);

    useEffect(() => {
        if (open) {
            setSelectedStock(null);
        }
    }, [open]);

    const stockOptions = codeLists || [];
    const loading = codeListsLoading && codeLists.length === 0;

    const {
        data: jumpData,
        isLoading: loadingJump,
        mutate: mutateJump,
    } = useJump({
        id: selectedStock?.code,
    });
    const handleCloseJump = () => {
        setShowJumpDialog(false);
    };

    const showJumpRecord = () => {
        let e = jumpData;
        if (!jumpData?.JumpsRecords) {
            enqueueSnackbar('沒有紀錄', { variant: 'error' });
            return;
        }
        let m = [];
        let w = [];
        let d = [];

        e?.JumpsRecords.forEach((r) => {
            if (r?.type === 'w') {
                w.push(r);
            } else if (r?.type === 'm') {
                m.push(r);
            } else {
                d.push(r);
            }
        });
        e.w = w;
        e.m = m;
        e.d = d;
        setShowJumpData(e);
        setShowJumpDialog(true);
    };

    const {
        data: runData,
        isLoading: loadingRun,
        mutate: mutateRun,
    } = useObserve({
        id: selectedStock?.code,
    });
    const showRunRecord = () => {
        let e = runData || {};
        if (!e?.id) {
            enqueueSnackbar('沒有紀錄', { variant: 'error' });
            return;
        }
        setShowRunData(e);
        setShowRunDialog(true);
    };
    const handleCloseRun = () => {
        setShowRunDialog(false);
    };

    const filterOptions = (options, { inputValue }) => {
        const filterValue = inputValue.toLowerCase();
        return options.filter((option) => option.code.toLowerCase().includes(filterValue) || option.name.toLowerCase().includes(filterValue));
    };

    return (
        <Dialog className='FastSearchModal' open={open} onClose={handleClose} maxWidth='sm' fullWidth>
            <DialogTitle>{'快速查詢'}</DialogTitle>
            <DialogContent>
                <Autocomplete
                    id='stock-search'
                    options={stockOptions}
                    getOptionLabel={(option) => `${option.name} (${option.code})`}
                    filterOptions={filterOptions}
                    renderOption={(props, option) => (
                        <Box component='li' sx={{ img: { mr: 2, flexShrink: 0 } }} {...props}>
                            {option.name} ({option.code})
                        </Box>
                    )}
                    loading={loading}
                    onChange={(event, value) => setSelectedStock(value)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label='股票代碼或名稱'
                            variant='outlined'
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: <>{params.InputProps.endAdornment}</>,
                            }}
                        />
                    )}
                />
                {selectedStock && (
                    <Box className='buttons' sx={{ display: 'flex', mt: 2, gap: 2 }}>
                        <Button disabled={loadingJump || !jumpData?.JumpsRecords} variant='contained' startIcon={<Jump />} component={Link} onClick={() => showJumpRecord()}>
                            跳空歷史
                        </Button>
                        <Button disabled={loadingRun || !runData?.id} variant='contained' startIcon={<DirectionsRunIcon />} component={Link} onClick={() => showRunRecord()}>
                            動能歷史
                        </Button>
                        <Button
                            variant='contained'
                            startIcon={<ShowChartIcon />}
                            component={Link}
                            target='_blank'
                            to={`https://www.istock.tw/stock/${selectedStock?.code}/contract-liability`}
                        >
                            合約負債
                        </Button>

                        <Button
                            variant='contained'
                            startIcon={<BarChartIcon />}
                            component={Link}
                            target='_blank'
                            to={`https://norway.twsthr.info/StockHolders.aspx?stock=${selectedStock?.code}`}
                        >
                            股權結構
                        </Button>

                        <Button
                            variant='contained'
                            startIcon={<Billion />}
                            component={Link}
                            target='_blank'
                            to={`https://www.findbillion.com/twstock/${selectedStock?.code}/financial_statement`}
                        >
                            財務分析
                        </Button>

                        <Button variant='contained' startIcon={<Dog />} component={Link} target='_blank' to={`https://statementdog.com/analysis/${selectedStock?.code}`}>
                            財報狗
                        </Button>
                    </Box>
                )}
                <JumpModal
                    loading={loadingJump}
                    actionPermission={actionPermission}
                    open={showJumpDialog}
                    handleClose={handleCloseJump}
                    recordData={showJumpData}
                    mutate={mutateJump}
                />
                <ObserveRecordModal
                    loading={loading}
                    actionPermission={actionPermission}
                    open={showRunDialog}
                    handleClose={handleCloseRun}
                    recordData={showRunData}
                    mutate={mutateRun}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>取消</Button>
            </DialogActions>
        </Dialog>
    );
}
