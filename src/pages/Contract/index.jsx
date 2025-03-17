import './index.scss';
import { listColumn } from '@/helpers/columnsContracts';
import { DataGrid } from '@mui/x-data-grid';
import { useRef, useState, useEffect } from 'react';
import NoResultsOverlay from '@/components/NoResultsOverlay';
import DataGridSkeleton from '@/components/DataGridSkeleton';
import { Button, Skeleton, Typography, IconButton } from '@mui/material';
import { generateMeasureTime } from '@/helpers/format';
import { useSnackbar } from 'notistack';
import usePermissionCheck from '@/helpers/usePermissionCheck';
import { AddCircleOutline, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import useContracts from '@/services/useContracts';
import { addContracts, bulkDeleteContract } from '@/services/contractApi';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { localeText } from '@/helpers/datagridHelper';
import CustomToolbar from '@/components/CustomToolbar';
import { useStore } from '@/stores/store';

function Contract() {
    const dashboardRef = useRef(null);
    const { setModalHandler, closeModal, setValue } = useStore();
    const actionPermission = usePermissionCheck('action');
    const [range, setRange] = useState(50);
    const [rank, setRank] = useState('percentage');
    const { enqueueSnackbar } = useSnackbar();
    const [selectedRows, setSelectedRows] = useState([]);

    // 獲取當前日期和設置預設季度
    const getDefaultQuarter = () => {
        const now = new Date();
        const year = now.getFullYear();
        const shortYear = year.toString().slice(2); // 取後兩位，如 2024 -> "24"
        const month = now.getMonth() + 1; // getMonth() 從 0 開始
        const day = now.getDate();

        // 根據日期判斷預設顯示的季度
        if (month < 3 || (month === 3 && day <= 31)) {
            // 1月-3月底前，顯示上一年的Q3
            return `${(year - 1).toString().slice(2)}Q3`;
        } else if (month < 5 || (month === 5 && day < 15)) {
            // 4月-5月15日前，顯示上一年的Q4
            return `${(year - 1).toString().slice(2)}Q4`;
        } else if (month < 8 || (month === 8 && day < 14)) {
            // 5月15日-8月14日前，顯示當年Q1
            return `${shortYear}Q1`;
        } else if (month < 11 || (month === 11 && day < 14)) {
            // 8月14日-11月14日前，顯示當年Q2
            return `${shortYear}Q2`;
        } else {
            // 11月14日後，顯示當年Q3
            return `${shortYear}Q3`;
        }
    };

    const getQuarterOptions = () => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const yearList = [currentYear - 2, currentYear - 1, currentYear]; // 包含前年、去年、今年
        const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

        return yearList.flatMap((year) =>
            quarters.map((q) => ({
                value: `${year.toString().slice(2)}${q}`,
                label: `${year.toString().slice(2)}${q}`,
                year: year,
                quarter: q,
            }))
        );
    };

    const getQuarterDeadline = (quarterValue) => {
        if (!quarterValue) return '';

        const q = quarterValue.slice(-2); // 獲取季度部分 Q1, Q2, Q3, Q4

        switch (q) {
            case 'Q1':
                return '5/15前公布';
            case 'Q2':
                return '8/14前公布';
            case 'Q3':
                return '11/14前公布';
            case 'Q4':
                return '次年3/31前公布';
            default:
                return '';
        }
    };

    const [quarter, setQuarter] = useState(getDefaultQuarter());
    const quarterOptions = getQuarterOptions();
    const { isLoading: loading, data: listData, updatedDate, mutate } = useContracts({ range, rank, quarter });

    // 查找當前季度在選項中的索引
    const getCurrentQuarterIndex = () => {
        return quarterOptions.findIndex((q) => q.value === quarter);
    };

    // 切換到上一個季度
    const handlePrevQuarter = () => {
        const currentIndex = getCurrentQuarterIndex();
        if (currentIndex > 0) {
            setQuarter(quarterOptions[currentIndex - 1].value);
        }
    };

    // 切換到下一個季度
    const handleNextQuarter = () => {
        const currentIndex = getCurrentQuarterIndex();
        if (currentIndex < quarterOptions.length - 1) {
            setQuarter(quarterOptions[currentIndex + 1].value);
        }
    };

    const addHandler = async () => {
        try {
            let result = await addContracts({ quarter });
            const { success } = result;
            if (success) {
                enqueueSnackbar('抓取成功', { variant: 'success' });
            }
        } catch (err) {
            enqueueSnackbar('抓取失敗', { variant: 'error' });
        }
    };

    const handleRankChange = (e) => {
        const newRank = e.target.value;
        setRank(newRank);
    };

    const handleRange = (event) => {
        setRange(event.target.value);
    };

    const handleQuarter = (event) => {
        setQuarter(event.target.value);
    };

    const handleCloseDelete = (refresh) => {
        closeModal(false);
        if (refresh) {
            mutate();
        }
    };
    const confirmBulkDelete = async () => {
        setValue('modalLoading', true);
        try {
            let result = await bulkDeleteContract(selectedRows);
            const { success, deletedCount } = result;
            if (success) {
                enqueueSnackbar(`成功刪除 ${deletedCount} 條記錄`, { variant: 'success' });
                handleCloseDelete(true);
                setSelectedRows([]);
                setValue('modalLoading', false);
            }
        } catch (err) {
            enqueueSnackbar('批量刪除失敗', { variant: 'error' });
            setValue('modalLoading', false);
        }
    };
    const bulkDeleteHandler = () => {
        if (selectedRows.length === 0) {
            enqueueSnackbar('請至少選擇一條記錄', { variant: 'warning' });
            return;
        }

        setModalHandler({
            func: confirmBulkDelete,
            text: (
                <div className='delete-content'>
                    <div className='delete-title'>
                        <div className='stock-set'>
                            <div className='stock-name-code'>
                                <div className='stock-name'>{'請確認是否刪除'}</div>
                                <div className='stock-code mr-1'>{`已選擇 ${selectedRows.length} 條跳空紀錄`}</div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        });
    };
    return (
        <div className='Dashboard'>
            <div className='dashboard-header'>
                <div className='header-left'>
                    <div className='title'>合約清單</div>
                </div>
                <div className='header-right'>
                    <div className='title'>
                        收盤價更新: <div className='flex-center'>{loading ? <Skeleton variant='text' width={135} /> : generateMeasureTime(updatedDate)}</div>{' '}
                        <span className='mins'>(每日 14:00 後更新)</span>
                    </div>
                </div>
            </div>
            <div className='title-action'>
                <div className='title-btns'>
                    <Button className='act' disabled={!actionPermission || range === 3} variant='contained' color='warning' startIcon={<AddCircleOutline />} onClick={addHandler}>
                        抓取
                    </Button>
                    <Button className='act' disabled={!actionPermission || selectedRows.length === 0} variant='contained' color='error' onClick={bulkDeleteHandler}>
                        批量刪除 ({selectedRows.length})
                    </Button>
                </div>
                <div className='date'>
                    <div className='date-range-outer'>
                        <div className='date-range'>
                            <ToggleButtonGroup color='primary' value={rank} exclusive onChange={handleRankChange} aria-label='Platform'>
                                <ToggleButton disabled={loading} variant={'contained'} color={'primary'} value={'percentage'}>
                                    佔股本
                                </ToggleButton>
                                <ToggleButton disabled={loading} variant={'contained'} color={'primary'} value={'qoq'}>
                                    QoQ
                                </ToggleButton>
                                <ToggleButton disabled={loading} variant={'contained'} color={'primary'} value={'yoy'}>
                                    YoY
                                </ToggleButton>
                                <ToggleButton disabled={loading} variant={'contained'} color={'primary'} value={'all'}>
                                    全部
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </div>
                        <div className='select-area'>
                            {rank !== 'all' && (
                                <Box sx={{ marginRight: 1 }}>
                                    <FormControl fullWidth>
                                        <InputLabel id='range-label'>大於</InputLabel>
                                        <Select labelId='range-label' value={range} label='大於' onChange={handleRange}>
                                            <MenuItem value={0}>0%</MenuItem>
                                            <MenuItem value={20}>20%</MenuItem>
                                            <MenuItem value={50}>50%</MenuItem>
                                            <MenuItem value={75}>75%</MenuItem>
                                            <MenuItem value={100}>100%</MenuItem>
                                            <MenuItem value={150}>150%</MenuItem>
                                            <MenuItem value={200}>200%</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            )}
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton size='small' onClick={handlePrevQuarter} disabled={getCurrentQuarterIndex() <= 0}>
                                        <ArrowBackIos fontSize='small' />
                                    </IconButton>
                                    <FormControl fullWidth>
                                        <InputLabel id='quarter-label'>季度</InputLabel>
                                        <Select labelId='quarter-label' value={quarter} label='季度' onChange={handleQuarter}>
                                            {quarterOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <IconButton size='small' onClick={handleNextQuarter} disabled={getCurrentQuarterIndex() >= quarterOptions.length - 1}>
                                        <ArrowForwardIos fontSize='small' />
                                    </IconButton>
                                </Box>
                                <Typography
                                    variant='caption'
                                    sx={{
                                        textAlign: 'center',
                                        mt: 0.5,
                                        color: 'text.secondary',
                                        fontSize: '0.7rem',
                                    }}
                                >
                                    {getQuarterDeadline(quarter)}
                                </Typography>
                            </Box>
                        </div>
                    </div>
                </div>
            </div>
            <div className='container'>
                <div className='table-wrapper'>
                    <DataGrid
                        className='table-root'
                        ref={dashboardRef}
                        rows={loading ? [] : listData || []}
                        getRowId={(row) => row.ContractsRecords?.id}
                        columns={listColumn()}
                        loading={loading}
                        checkboxSelection
                        disableSelectionOnClick={false}
                        onSelectionModelChange={(newSelectionModel) => {
                            setSelectedRows(newSelectionModel);
                        }}
                        selectionModel={selectedRows}
                        componentsProps={{
                            pagination: {
                                labelRowsPerPage: '每頁筆數:',
                            },
                        }}
                        initialState={{
                            sorting: {
                                sortModel: [{ field: 'percentage', sort: 'desc' }],
                            },
                        }}
                        localeText={localeText()}
                        density='compact'
                        sortingOrder={['desc', 'asc']}
                        components={{
                            Toolbar: () => CustomToolbar(),
                            NoRowsOverlay: NoResultsOverlay,
                            NoResultsOverlay: NoResultsOverlay,
                            LoadingOverlay: DataGridSkeleton,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default Contract;
