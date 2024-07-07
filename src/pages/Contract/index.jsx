import './index.scss';
import { listColumn } from '@/helpers/columnsContracts';
import { DataGrid } from '@mui/x-data-grid';
import { useRef, useState } from 'react';
import NoResultsOverlay from '@/components/NoResultsOverlay';
import DataGridSkeleton from '@/components/DataGridSkeleton';
import { Button, Skeleton } from '@mui/material';
import { generateMeasureTime } from '@/helpers/format';
import { useSnackbar } from 'notistack';
import usePermissionCheck from '@/helpers/usePermissionCheck';
import { AddCircleOutline } from '@mui/icons-material';
import useContracts from '@/services/useContracts';
import { addContracts } from '@/services/contractApi';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { localeText } from '@/helpers/datagridHelper';
import CustomToolbar from '@/components/CustomToolbar';

function Contract() {
    const dashboardRef = useRef(null);
    const actionPermission = usePermissionCheck('action');
    const [loadingAction, setLoadingAction] = useState(false);
    const [quarter, setQuarter] = useState('24Q1');
    const [range, setRange] = useState(50);
    const [rank, setRank] = useState('percentage');
    const { enqueueSnackbar } = useSnackbar();
    const { isLoading: loading, data: listData, updatedDate } = useContracts({ range, rank, quarter });

    const addHandler = async () => {
        setLoadingAction(true);
        try {
            let result = await addContracts({ quarter });
            const { success } = result;
            if (success) {
                enqueueSnackbar('抓取成功', { variant: 'success' });
                setLoadingAction(false);
            }
        } catch (err) {
            enqueueSnackbar('抓取失敗', { variant: 'error' });
            setLoadingAction(false);
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
                    <Button
                        className='act'
                        disabled={loadingAction || !actionPermission || range === 3}
                        variant='contained'
                        color='warning'
                        startIcon={<AddCircleOutline />}
                        onClick={addHandler}
                    >
                        抓取
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
                            <Box>
                                <FormControl fullWidth>
                                    <InputLabel id='quarter-label'>季度</InputLabel>
                                    <Select labelId='quarter-label' value={quarter} label='季度' onChange={handleQuarter}>
                                        <MenuItem value={'24Q1'}>24Q1</MenuItem>
                                        <MenuItem value={'24Q2'}>24Q2</MenuItem>
                                        <MenuItem value={'24Q3'}>24Q3</MenuItem>
                                        <MenuItem value={'24Q4'}>24Q4</MenuItem>
                                    </Select>
                                </FormControl>
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
                        getRowId={(row) => row.code}
                        columns={listColumn()}
                        loading={loading}
                        disableSelectionOnClick
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
