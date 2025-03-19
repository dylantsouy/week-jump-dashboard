import { RenderCellExpand } from '@/components/RenderCellExpand';
import { rateMapping, profitHandler, dateGap, generateMeasureDate, calculateTargetPriceRange, targetColorHandler } from './format';
import { Tooltip } from '@mui/material';
import { Delete, Edit, MonetizationOn } from '@mui/icons-material';
import MessageIcon from '@mui/icons-material/Message';
import ScreenSearchDesktopIcon from '@mui/icons-material/ScreenSearchDesktop';
import MultiLineHeader from './MultiLineHeader';

export const listColumn = (editHandler, deleteHandler, epsHandler, newsHandler, actionPermission, showFastSearchHandler) => {
    return [
        {
            field: 'name',
            headerName: '股票',
            width: 100,
            pinned: 'left',
            valueGetter: (params) => `${params.data.code} ${params.data.name}`,
            cellRenderer: (params) => {
                const { data } = params;
                return (
                    <div className='column_center_center'>
                        <div>{data?.name}</div>
                        <a href={`https://tw.stock.yahoo.com/quote/${data?.code}.TW/technical-analysis`} target='_blank' rel='noreferrer'>
                            {data?.code}
                        </a>
                    </div>
                );
            },
        },
        {
            field: 'industry',
            headerName: '產業',
            width: 90,
            cellRenderer: RenderCellExpand,
        },
        {
            field: 'rate',
            headerName: '評等',
            width: 40,
            valueGetter: (params) => {
                const { data } = params;
                const map = {
                    1: '持有',
                    2: '看好',
                    3: '有機會',
                    4: '需等待',
                    5: '待觀察',
                    6: '中立',
                    7: '已反應',
                    8: '有風險',
                    9: '中立偏空',
                    10: '不看好',
                };

                return map[data?.rate];
            },
            cellRenderer: (params) => {
                const { data } = params;
                return rateMapping(data?.rate);
            },
        },
        {
            field: 'initPrice',
            headerName: '觀察價',
            width: 80,
            cellRenderer: RenderCellExpand,
        },
        {
            field: 'price',
            headerName: '收盤價',
            width: 80,
            cellRenderer: RenderCellExpand,
        },
        {
            field: 'profit',
            headerName: '損益',
            width: 70,
            valueGetter: (params) => {
                const { data } = params;
                const profit = Math.round((((data?.price - data?.initPrice) / data?.initPrice) * 100 + Number.EPSILON) * 10) / 10;
                return profit;
            },
            cellRenderer: (params) => {
                const { data } = params;
                const profit = Math.round((((data?.price - data?.initPrice) / data?.initPrice) * 100 + Number.EPSILON) * 10) / 10;
                return profitHandler(profit);
            },
        },
        {
            field: 'news',
            headerName: '消息',
            width: 40,
            sortable: false,
            valueGetter: () => {
                return '詳情請查看網站';
            },
            cellRenderer: (params) => {
                return (
                    <div className='action text-center'>
                        <Tooltip title={'看消息'} placement='bottom'>
                            <MessageIcon className='action-icon' onClick={() => newsHandler(params.data)} />
                        </Tooltip>
                    </div>
                );
            },
        },
        {
            field: 'deadline',
            headerName: '題材',
            width: 150,
            cellRenderer: RenderCellExpand,
        },
        {
            field: 'eps2024',
            headerName: '2024 EPS',
            headerComponent: MultiLineHeader,
            headerComponentParams: {
                text: (
                    <div className='column_center_center'>
                        <div>2024</div>
                        <div>EPS</div>
                    </div>
                ),
            },
            headerClass: 'primary',
            cellClass: 'primary',
            width: 56,
            valueGetter: (params) => {
                const { data } = params;
                return data?.eps?.eps2024 || '-';
            },
            cellRenderer: (params) => {
                const { data } = params;
                return data?.eps?.eps2024 || '-';
            },
        },
        {
            field: 'eps2025',
            headerName: '2025 EPS',
            headerComponent: MultiLineHeader,
            headerComponentParams: {
                text: (
                    <div className='column_center_center'>
                        <div>2025</div>
                        <div>EPS</div>
                    </div>
                ),
            },
            headerClass: 'warning',
            cellClass: 'warning',
            width: 56,
            valueGetter: (params) => {
                const { data } = params;
                return data?.eps?.eps2025 || '-';
            },
            cellRenderer: (params) => {
                const { data } = params;
                return data?.eps?.eps2025 || '-';
            },
        },
        {
            field: 'pe2025',
            headerName: '2025 PE',
            headerComponent: MultiLineHeader,
            headerComponentParams: {
                text: (
                    <div className='column_center_center'>
                        <div>2025</div>
                        <div>PE</div>
                    </div>
                ),
            },
            headerClass: 'warning',
            cellClass: 'warning',
            width: 56,
            valueGetter: (params) => {
                const { data } = params;
                if (data?.price && data?.eps?.eps2025) {
                    if (data?.eps?.eps2025 < 0) {
                        return 'N/A';
                    }
                    return (data?.price / data?.eps?.eps2025).toFixed(2);
                }
                return '-';
            },
            cellRenderer: (params) => {
                const { data } = params;
                if (data?.price && data?.eps?.eps2025) {
                    if (data?.eps?.eps2025 < 0) {
                        return 'N/A';
                    }
                    return (data?.price / data?.eps?.eps2025).toFixed(2);
                }
                return '-';
            },
        },
        {
            field: 'gdata2025',
            headerName: '2025 成長',
            headerComponent: MultiLineHeader,
            headerComponentParams: {
                text: (
                    <div className='column_center_center'>
                        <div>2025</div>
                        <div>成長</div>
                    </div>
                ),
            },
            headerClass: 'warning',
            cellClass: 'warning',
            width: 56,
            valueGetter: (params) => {
                const { data } = params;
                if (data?.eps?.eps2024 && data?.eps?.eps2025) {
                    if (data?.eps?.eps2024 < 0 && data?.eps?.eps2025 > 0) {
                        return '虧轉盈';
                    }
                    const gdatathRate = ((data.eps.eps2025 - data.eps.eps2024) / data.eps.eps2024) * 100;
                    return gdatathRate.toFixed(1) + '%';
                }
                return '-';
            },
            cellRenderer: (params) => {
                const { data } = params;
                if (data?.eps?.eps2024 && data?.eps?.eps2025) {
                    if (data?.eps?.eps2024 < 0 && data?.eps?.eps2025 > 0) {
                        return '虧轉盈';
                    }
                    const gdatathRate = ((data.eps.eps2025 - data.eps.eps2024) / data.eps.eps2024) * 100;
                    return gdatathRate.toFixed(1) + '%';
                }
                return '-';
            },
        },
        {
            field: 'eps2026',
            headerName: '2026 EPS',
            headerComponent: MultiLineHeader,
            headerComponentParams: {
                text: (
                    <div className='column_center_center'>
                        <div>2026</div>
                        <div>EPS</div>
                    </div>
                ),
            },
            headerClass: 'primary',
            cellClass: 'primary',
            width: 56,
            valueGetter: (params) => {
                const { data } = params;
                return data?.eps?.eps2026 || '-';
            },
            cellRenderer: (params) => {
                const { data } = params;
                return data?.eps?.eps2026 || '-';
            },
        },
        {
            field: 'pe2026',
            headerName: '2026 PE',
            headerComponent: MultiLineHeader,
            headerComponentParams: {
                text: (
                    <div className='column_center_center'>
                        <div>2026</div>
                        <div>PE</div>
                    </div>
                ),
            },
            headerClass: 'primary',
            cellClass: 'primary',
            width: 56,
            valueGetter: (params) => {
                const { data } = params;
                if (data?.price && data?.eps?.eps2026) {
                    if (data?.eps?.eps2026 < 0) {
                        return 'N/A';
                    }
                    return (data?.price / data?.eps?.eps2026).toFixed(2);
                }
                return '-';
            },
            cellRenderer: (params) => {
                const { data } = params;
                if (data?.price && data?.eps?.eps2026) {
                    if (data?.eps?.eps2026 < 0) {
                        return 'N/A';
                    }
                    return (data?.price / data?.eps?.eps2026).toFixed(2);
                }
                return '-';
            },
        },
        {
            field: 'gdata2026',
            headerName: '2026 成長',
            headerComponent: MultiLineHeader,
            headerComponentParams: {
                text: (
                    <div className='column_center_center'>
                        <div>2026</div>
                        <div>成長</div>
                    </div>
                ),
            },
            headerClass: 'primary',
            cellClass: 'primary',
            width: 56,
            valueGetter: (params) => {
                const { data } = params;
                if (data?.eps?.eps2025 && data?.eps?.eps2026) {
                    if (data?.eps?.eps2025 < 0 && data?.eps?.eps2025 > 0) {
                        return '虧轉盈';
                    }
                    const gdatathRate = ((data.eps.eps2026 - data.eps.eps2025) / data.eps.eps2025) * 100;
                    return gdatathRate.toFixed(1) + '%';
                }
                return '-';
            },
            cellRenderer: (params) => {
                const { data } = params;
                if (data?.eps?.eps2025 && data?.eps?.eps2026) {
                    if (data?.eps?.eps2025 < 0 && data?.eps?.eps2025 > 0) {
                        return '虧轉盈';
                    }
                    const gdatathRate = ((data.eps.eps2026 - data.eps.eps2025) / data.eps.eps2025) * 100;
                    return gdatathRate.toFixed(1) + '%';
                }
                return '-';
            },
        },
        {
            field: 'editEps',
            headerName: '營收',
            width: 50,
            sortable: false,
            valueGetter: () => {
                return '詳情請查看網站';
            },
            cellRenderer: (params) => {
                return (
                    <div className='action text-center'>
                        <Tooltip title={'營收明細'} placement='bottom'>
                            <MonetizationOn className='action-icon' onClick={() => epsHandler(params.data)} />
                        </Tooltip>
                    </div>
                );
            },
        },
        {
            field: 'averagePE',
            headerName: '歷史 PE',
            width: 90,
            cellRenderer: RenderCellExpand,
        },
        {
            field: 'targetPrice25',
            headerName: '2025股價',
            headerComponent: MultiLineHeader,
            headerComponentParams: {
                text: (
                    <div className='column_center_center'>
                        <div>2025</div>
                        <div>股價</div>
                    </div>
                ),
            },
            width: 70,
            valueGetter: (params) => {
                const { data } = params;
                const targetPrice = calculateTargetPriceRange(data?.eps?.eps2025, data?.averagePE);
                return data?.eps?.eps2025 && data?.averagePE ? `${targetPrice[0]} ~ ${targetPrice[1]}` : '-';
            },
            cellRenderer: (params) => {
                const { data } = params;
                if (data?.eps?.eps2025 && data?.eps?.eps2025 > 0 && data?.averagePE) {
                    const now = data?.price;
                    const targetPrice = calculateTargetPriceRange(data?.eps?.eps2025, data?.averagePE);
                    return targetColorHandler(now, targetPrice[0], targetPrice[1]);
                }
                return '-';
            },
        },
        {
            field: 'targetPrice26',
            headerName: '2026股價',
            headerComponent: MultiLineHeader,
            headerComponentParams: {
                text: (
                    <div className='column_center_center'>
                        <div>2026</div>
                        <div>股價</div>
                    </div>
                ),
            },
            width: 70,
            valueGetter: (params) => {
                const { data } = params;
                const targetPrice = calculateTargetPriceRange(data?.eps?.eps2026, data?.averagePE);
                return data?.eps?.eps2026 && data?.averagePE ? `${targetPrice[0]} ~ ${targetPrice[1]}` : '-';
            },
            cellRenderer: (params) => {
                const { data } = params;
                if (data?.eps?.eps2026 && data?.eps?.eps2026 > 0 && data?.averagePE) {
                    const now = data?.price;
                    const targetPrice = calculateTargetPriceRange(data?.eps?.eps2026, data?.averagePE);
                    return targetColorHandler(now, targetPrice[0], targetPrice[1]);
                }
                return '-';
            },
        },
        {
            field: 'createdAt',
            headerName: '觀察日期',
            width: 80,
            sort: 'desc',
            valueGetter: (params) => {
                const { data } = params;
                return generateMeasureDate(data?.createdAt);
            },
            cellRenderer: (params) => {
                const { data } = params;
                return generateMeasureDate(data?.createdAt);
            },
        },
        {
            field: 'gap',
            headerName: '過多久',
            width: 56,
            editable: false,
            valueGetter: (params) => {
                const { data } = params;
                return dateGap(data?.createdAt);
            },
            cellRenderer: (params) => {
                const { data } = params;
                return dateGap(data?.createdAt);
            },
        },
        {
            field: 'CAGR',
            headerName: 'CAGR',
            width: 70,
            valueGetter: (params) => {
                const { data } = params;
                return data?.CAGR || '-';
            },
            cellRenderer: RenderCellExpand,
        },
        {
            field: 'action',
            headerName: '操作',
            minWidth: 160,
            flex: 1,
            headerClass: 'left',
            cellClass: 'left',
            sortable: false,
            cellRenderer: (params) => {
                return (
                    <div className='action'>
                        <Tooltip title={'快速查詢'} placement='bottom'>
                            <ScreenSearchDesktopIcon className='action-icon mr-2' onClick={() => showFastSearchHandler({ code: params?.data?.code, name: params?.data?.name })} />
                        </Tooltip>
                        {actionPermission ? (
                            <Tooltip title={'編輯基本'} placement='bottom'>
                                <Edit className='action-icon mr-2' onClick={() => editHandler(params.data)} />
                            </Tooltip>
                        ) : (
                            <Tooltip title={'沒有權限'} placement='bottom'>
                                <Edit className='action-icon disabled mr-2' />
                            </Tooltip>
                        )}
                        {actionPermission ? (
                            <Tooltip title={'刪除'} placement='bottom'>
                                <Delete className='action-icon warning mr-2' onClick={() => deleteHandler(params.data)} />
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
