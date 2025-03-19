import './styles.scss';
import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { InputAdornment, TextField, IconButton, Tooltip, Box, Skeleton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GetAppIcon from '@mui/icons-material/GetApp';
import { AG_GRID_LOCALE_TW } from '@ag-grid-community/locale';
import { NoDataIcon } from '@/assets/icons';
import usePermissionCheck from '@/helpers/usePermissionCheck';

export default function DataGrid({ rowData, columnDefs, isLoading, children, setSelectedRows, ifShowSelect }) {
    const actionPermission = usePermissionCheck('action');
    const [gridApi, setGridApi] = useState(null);
    const [quickFilter, setQuickFilter] = useState('');

    useEffect(() => {
        if (gridApi) {
            if (!isLoading && (!rowData || rowData.length === 0)) {
                gridApi.showNoRowsOverlay();
            } else {
                gridApi.hideOverlay();
            }
        }
    }, [rowData, gridApi, isLoading]);

    const onGridReady = (params) => {
        setGridApi(params.api);
    };

    const handleExport = () => {
        if (gridApi) {
            gridApi.exportDataAsCsv();
        }
    };

    const handleQuickFilter = (e) => {
        const value = e.target.value;
        setQuickFilter(value);
        if (gridApi) {
            gridApi.setQuickFilter(value);
        }
    };

    const onSelectionChanged = () => {
        if (gridApi) {
            const selectedNodes = gridApi.getSelectedNodes();
            const selectedData = selectedNodes.map((node) => node.data);
            setSelectedRows(selectedData);
        }
    };

    const ifSelectColumnDefs = () => {
        if (!ifShowSelect) {
            return columnDefs;
        } else {
            return [
                ...(actionPermission
                    ? [
                          {
                              sortable: false,
                              headerCheckboxSelection: true,
                              checkboxSelection: true,
                              width: 50,
                              pinned: 'left',
                          },
                      ]
                    : []),
                ...columnDefs,
            ];
        }
    };
    return (
        <>
            <div className='title-switch'>
                {children}
                <div className='toolbar'>
                    <TextField
                        label={'搜尋'}
                        placeholder={'輸入關鍵字搜尋'}
                        variant='outlined'
                        fullWidth
                        size='small'
                        className='quick-filter-input'
                        value={quickFilter}
                        onChange={handleQuickFilter}
                        margin='normal'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Tooltip title={'匯出'} placement='bottom'>
                        <IconButton onClick={handleExport}>
                            <GetAppIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>

            <div className='ag-theme-material ag-container'>
                {isLoading ? (
                    <Box className='loading-skeleton'>
                        <Skeleton variant='rectangular' width='100%' height={32} />
                        <Skeleton variant='rectangular' width='100%' height={47} />
                        <Skeleton variant='rectangular' width='100%' height={47} />
                        <Skeleton variant='rectangular' width='100%' height={47} />
                        <Skeleton variant='rectangular' width='100%' height={47} />
                        <Skeleton variant='rectangular' width='100%' height={47} />
                        <Skeleton variant='rectangular' width='100%' height={47} />
                        <Skeleton variant='rectangular' width='100%' height={47} />
                        <Skeleton variant='rectangular' width='100%' height={47} />
                        <Skeleton variant='rectangular' width='100%' height={47} />
                        <Skeleton variant='rectangular' width='100%' height={47} />
                    </Box>
                ) : (
                    <>
                        <AgGridReact
                            rowData={rowData || []}
                            columnDefs={ifSelectColumnDefs()}
                            domLayout='normal'
                            pagination={true}
                            paginationPageSize={20}
                            quickFilterText={quickFilter}
                            onGridReady={onGridReady}
                            localeText={AG_GRID_LOCALE_TW}
                            overlayNoRowsTemplate={'<div></div>'}
                            rowSelection={{
                                mode: 'multiRow',
                                checkboxes: false,
                                headerCheckbox: false,
                                enableClickSelection: false,
                            }}
                            onSelectionChanged={onSelectionChanged}
                            defaultColDef={{
                                lockPinned: true,
                                filter: false,
                                sortable: true,
                                resizable: true,
                                cellStyle: { userSelect: 'text' },
                            }}
                        />
                        {/* 自訂 No Data 畫面 */}
                        {!isLoading && (!rowData || rowData?.length === 0) && (
                            <Box className='NoData'>
                                <NoDataIcon />
                                <div className='nodata-title'>尚無資料</div>
                                <div className='nodata-sub'>請選擇其他過濾條件</div>
                            </Box>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
