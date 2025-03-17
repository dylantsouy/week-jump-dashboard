import { RenderCellExpand } from '@/components/RenderCellExpand';
import { rateMapping, profitHandler, dateGap, generateMeasureDate, calculateTargetPriceRange, targetColorHandler } from './format';
import { Tooltip } from '@mui/material';
import { Delete, Edit, MonetizationOn } from '@mui/icons-material';
import MessageIcon from '@mui/icons-material/Message';
import ScreenSearchDesktopIcon from '@mui/icons-material/ScreenSearchDesktop';

export const listColumn = (editHandler, deleteHandler, epsHandler, newsHandler, actionPermission, showFastSearchHandler) => {
    return [
        {
            field: 'name',
            headerName: '名稱',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 90,
            width: 90,
            renderCell: RenderCellExpand,
        },
        {
            field: 'industry',
            headerName: '產業',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 58,
            width: 58,
            renderCell: RenderCellExpand,
        },
        {
            field: 'code',
            headerName: '代碼',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 50,
            width: 50,
            renderCell: (params) => {
                const { row } = params;
                return (
                    <a href={`https://agdstock.club/stock/${row?.code}`} target='_blank' rel='noreferrer'>
                        {row?.code}
                    </a>
                );
            },
        },
        {
            field: 'rate',
            headerName: '評等',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 60,
            width: 60,
            renderCell: (params) => {
                const { row } = params;
                return rateMapping(row?.rate);
            },
        },
        {
            field: 'initPrice',
            headerName: '觀察價',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 58,
            width: 58,
            renderCell: RenderCellExpand,
        },
        {
            field: 'price',
            headerName: '收盤價',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 58,
            width: 58,
            renderCell: RenderCellExpand,
        },
        {
            field: 'profit',
            headerName: '損益',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 58,
            width: 58,
            renderCell: (params) => {
                const { row } = params;
                const profit = Math.round((((row?.price - row?.initPrice) / row?.initPrice) * 100 + Number.EPSILON) * 10) / 10;
                return profitHandler(profit);
            },
        },
        {
            field: 'news',
            headerName: '消息',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 50,
            width: 50,
            editable: false,
            renderCell: (params) => {
                return (
                    <div className='action text-center'>
                        <Tooltip title={'看消息'} placement='bottom'>
                            <MessageIcon className='action-icon' onClick={() => newsHandler(params.row)} />
                        </Tooltip>
                    </div>
                );
            },
        },
        {
            field: 'deadline',
            headerName: '題材',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 120,
            width: 120,
            renderCell: RenderCellExpand,
        },
        {
            field: 'eps2024',
            headerName: '2024 EPS',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>2024</div>
                    <div>EPS</div>
                </div>
            ),
            headerClassName: 'eps2024',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'eps2024',
            minWidth: 56,
            width: 56,
            renderCell: (params) => {
                const { row } = params;
                return row?.eps?.eps2024 || '-';
            },
        },
        {
            field: 'eps2025',
            headerName: '2025 EPS',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>2025</div>
                    <div>EPS</div>
                </div>
            ),
            headerClassName: 'eps2025',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'eps2025',
            minWidth: 56,
            width: 56,
            renderCell: (params) => {
                const { row } = params;
                return row?.eps?.eps2025 || '-';
            },
        },
        {
            field: 'pe2025',
            headerName: '2025 PE',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>2025</div>
                    <div>PE</div>
                </div>
            ),
            headerClassName: 'eps2025',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'eps2025',
            minWidth: 56,
            width: 56,
            renderCell: (params) => {
                const { row } = params;
                if (row?.price && row?.eps?.eps2025) {
                    if (row?.eps?.eps2025 < 0) {
                        return 'N/A';
                    }
                    return (row?.price / row?.eps?.eps2025).toFixed(2);
                }
                return '-';
            },
        },
        {
            field: 'grow2025',
            headerName: '2025 成長',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>2025</div>
                    <div>成長</div>
                </div>
            ),
            headerClassName: 'eps2025',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'eps2025',
            minWidth: 56,
            width: 56,
            renderCell: (params) => {
                const { row } = params;
                if (row?.eps?.eps2024 && row?.eps?.eps2025) {
                    if (row?.eps?.eps2024 < 0 && row?.eps?.eps2025 > 0) {
                        return '虧轉盈';
                    }
                    const growthRate = ((row.eps.eps2025 - row.eps.eps2024) / row.eps.eps2024) * 100;
                    return growthRate.toFixed(1) + '%';
                }
                return '-';
            },
        },
        {
            field: 'eps2026',
            headerName: '2026 EPS',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>2026</div>
                    <div>EPS</div>
                </div>
            ),
            headerClassName: 'eps2026',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'eps2026',
            minWidth: 56,
            width: 56,
            renderCell: (params) => {
                const { row } = params;
                return row?.eps?.eps2026 || '-';
            },
        },
        {
            field: 'pe2026',
            headerName: '2026 PE',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>2026</div>
                    <div>PE</div>
                </div>
            ),
            headerClassName: 'eps2026',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'eps2026',
            minWidth: 56,
            width: 56,
            renderCell: (params) => {
                const { row } = params;
                if (row?.price && row?.eps?.eps2026) {
                    if (row?.eps?.eps2026 < 0) {
                        return 'N/A';
                    }
                    return (row?.price / row?.eps?.eps2026).toFixed(2);
                }
                return '-';
            },
        },
        {
            field: 'grow2026',
            headerName: '2026 成長',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>2026</div>
                    <div>成長</div>
                </div>
            ),
            headerClassName: 'eps2026',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'eps2026',
            minWidth: 56,
            width: 56,
            renderCell: (params) => {
                const { row } = params;
                if (row?.eps?.eps2025 && row?.eps?.eps2026) {
                    if (row?.eps?.eps2025 < 0 && row?.eps?.eps2025 > 0) {
                        return '虧轉盈';
                    }
                    const growthRate = ((row.eps.eps2026 - row.eps.eps2025) / row.eps.eps2025) * 100;
                    return growthRate.toFixed(1) + '%';
                }
                return '-';
            },
        },
        {
            field: 'editEps',
            headerName: '營收',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 50,
            width: 50,
            editable: false,
            renderCell: (params) => {
                return (
                    <div className='action text-center'>
                        <Tooltip title={'營收明細'} placement='bottom'>
                            <MonetizationOn className='action-icon' onClick={() => epsHandler(params.row)} />
                        </Tooltip>
                    </div>
                );
            },
        },
        {
            field: 'averagePE',
            headerName: '歷史 PE',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>歷史</div>
                    <div>PE</div>
                </div>
            ),
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 56,
            width: 56,
            renderCell: RenderCellExpand,
        },
        {
            field: 'targetPrice25',
            headerName: '2025股價',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>2025</div>
                    <div>股價</div>
                </div>
            ),
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 56,
            width: 56,
            renderCell: (params) => {
                const { row } = params;
                if (row?.eps?.eps2025 && row?.eps?.eps2025 > 0 && row?.averagePE) {
                    const now = row?.price;
                    const targetPrice = calculateTargetPriceRange(row?.eps?.eps2025, row?.averagePE);
                    return targetColorHandler(now, targetPrice[0], targetPrice[1]);
                }
                return '-';
            },
        },
        {
            field: 'targetPrice26',
            headerName: '2026股價',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>2026</div>
                    <div>股價</div>
                </div>
            ),
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 56,
            width: 56,
            renderCell: (params) => {
                const { row } = params;
                if (row?.eps?.eps2026 && row?.eps?.eps2026 > 0 && row?.averagePE) {
                    const now = row?.price;
                    const targetPrice = calculateTargetPriceRange(row?.eps?.eps2026, row?.averagePE);
                    return targetColorHandler(now, targetPrice[0], targetPrice[1]);
                }
                return '-';
            },
        },
        {
            field: 'createdAt',
            headerName: '觀察日期',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 80,
            width: 80,
            editable: false,
            renderCell: (params) => {
                const { row } = params;
                return generateMeasureDate(row?.createdAt);
            },
        },
        {
            field: 'gap',
            headerName: '過多久',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>過多久</div>
                    <div>(天)</div>
                </div>
            ),
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 56,
            width: 56,
            editable: false,
            renderCell: (params) => {
                const { row } = params;
                return dateGap(row?.createdAt);
            },
        },
        {
            field: 'CAGR',
            headerName: 'CAGR',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>CAGR</div>
                    <div>(%)</div>
                </div>
            ),
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 54,
            width: 54,
            renderCell: RenderCellExpand,
        },
        {
            field: 'action',
            filterable: false,
            sortable: false,
            disableExport: true,
            headerName: '操作',
            minWidth: 130,
            flex: 1,
            renderCell: (params) => {
                return (
                    <div className='action'>
                        <Tooltip title={'快速查詢'} placement='bottom'>
                            <ScreenSearchDesktopIcon className='action-icon mr-2' onClick={() => showFastSearchHandler({ code: params?.row?.code, name: params?.row?.name })} />
                        </Tooltip>
                        {actionPermission ? (
                            <Tooltip title={'編輯基本'} placement='bottom'>
                                <Edit className='action-icon mr-2' onClick={() => editHandler(params.row)} />
                            </Tooltip>
                        ) : (
                            <Tooltip title={'沒有權限'} placement='bottom'>
                                <Edit className='action-icon disabled mr-2' />
                            </Tooltip>
                        )}
                        {actionPermission ? (
                            <Tooltip title={'刪除'} placement='bottom'>
                                <Delete className='action-icon warning mr-2' onClick={() => deleteHandler(params.row)} />
                            </Tooltip>
                        ) : (
                            <Tooltip title={'沒有權限'} placement='bottom'>
                                <Delete className='action-icon disabled mr-2' />
                            </Tooltip>
                        )}
                    </div>
                );
            },
        },
    ];
};
