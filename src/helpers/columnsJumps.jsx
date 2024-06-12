import { jumpTypeMapping, profitHandler } from './format';
import { Tooltip } from '@mui/material';
import { Delete, RemoveRedEye } from '@mui/icons-material';
import moment from 'moment';

export const listColumn = (showRecord, deleteHandler, actionPermission, range) => {
    return [
        {
            field: 'name',
            headerName: '名稱',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 80,
            width: 80,
            valueGetter: (params) => params.row.Stock.name,
            renderCell: (params) => {
                const { row } = params;
                return row?.Stock?.name;
            },
        },
        {
            field: 'industry',
            headerName: '產業',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 70,
            width: 70,
            valueGetter: (params) => params.row.Stock.industry,
            renderCell: (params) => {
                const { row } = params;
                return row?.Stock?.industry;
            },
        },
        {
            field: 'code',
            headerName: '代碼',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 50,
            width: 50,
            valueGetter: (params) => params.row.Stock.code,
            renderCell: (params) => {
                const { row } = params;
                return (
                    <a href={`https://tw.stock.yahoo.com/quote/${row?.Stock?.code}.TW/technical-analysis`} target='_blank' rel='noreferrer'>
                        {row?.Stock?.code}
                    </a>
                );
            },
        },
        {
            field: 'jumpCount_w',
            headerName: '周跳次數',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>周跳</div>
                    <div>未補 / 總數</div>
                </div>
            ),
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 78,
            width: 78,
            valueGetter: (params) => params.row.details.jumpCount_w,
            renderCell: (params) => {
                const { row } = params;
                return `${row?.details.jumpCount_w - row?.details.jumpCount_w_c} / ${row?.details.jumpCount_w}`;
            },
        },
        {
            field: 'jumpCount_m',
            headerName: '月跳次數',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>月跳</div>
                    <div>未補 / 總數</div>
                </div>
            ),
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 78,
            width: 78,
            valueGetter: (params) => params.row.details.jumpCount_m,
            renderCell: (params) => {
                const { row } = params;
                return `${row?.details.jumpCount_m - row?.details.jumpCount_m_c} / ${row?.details.jumpCount_m}`;
            },
        },
        {
            field: 'newestDate',
            headerName: '最新跳空',
            renderHeader: () =>
                range === 3 ? (
                    <div className='column_center_center'>
                        <div>最新</div>
                        <div>跳空</div>
                    </div>
                ) : (
                    <div className='column_center_center'>日期</div>
                ),
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 80,
            width: 80,
            valueGetter: (params) => params.row.newest.date,
            renderCell: (params) => {
                const { row } = params;
                return row?.newest?.date ? moment(row?.newest?.date).format('YYYY/MM/DD') : '';
            },
        },
        {
            field: 'newestType',
            headerName: '類型',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 56,
            width: 56,
            valueGetter: (params) => params.row.newest.type,
            renderCell: (params) => {
                const { row } = params;
                return jumpTypeMapping(row?.newest?.type);
            },
        },
        {
            field: 'jumpPrice',
            headerName: '開盤價',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 60,
            width: 60,
            valueGetter: (params) => params.row.newest.jumpPrice,
            renderCell: (params) => {
                const { row } = params;
                return row?.newest?.jumpPrice;
            },
        },
        {
            field: 'price',
            headerName: '現價',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 60,
            width: 60,
            valueGetter: (params) => params.row.Stock.price,
            renderCell: (params) => {
                const { row } = params;
                return row?.Stock?.price;
            },
        },
        {
            field: 'newestLastPrice',
            headerName: '補上價格',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>補上</div>
                    <div>價格</div>
                </div>
            ),
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 60,
            width: 60,
            valueGetter: (params) => params.row.newest.lastPrice,
            renderCell: (params) => {
                const { row } = params;
                return row?.newest?.lastPrice;
            },
        },
        {
            field: 'gap',
            headerName: '距離',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 60,
            width: 60,
            valueGetter: (params) => {
                const { row } = params;
                const gap = +(+row?.Stock?.price - row?.newest?.lastPrice).toFixed(2);
                return gap > 0 ? gap : '-';
            },
            renderCell: (params) => {
                const { row } = params;
                const gap = +(+row?.Stock?.price - row?.newest?.lastPrice).toFixed(2);
                return gap > 0 ? gap : '-';
            },
        },
        {
            field: 'gapPercent',
            headerName: '距離 %',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>距離</div>
                    <div>(%)</div>
                </div>
            ),
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 60,
            width: 60,
            valueGetter: (params) => {
                const { row } = params;
                const gap = Math.round((((row?.Stock?.price - row?.newest?.lastPrice) / row?.newest?.lastPrice) * 100 + Number.EPSILON) * 10) / 10;
                return gap;
            },
            renderCell: (params) => {
                const { row } = params;
                const gap = Math.round((((row?.Stock?.price - row?.newest?.lastPrice) / row?.newest?.lastPrice) * 100 + Number.EPSILON) * 10) / 10;
                return gap > 0 ? profitHandler(gap) : '-';
            },
        },
        {
            field: 'newestClosed',
            headerName: '是否補上',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>是否</div>
                    <div>補上</div>
                </div>
            ),
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 60,
            width: 60,
            valueGetter: (params) => params.row.newest.closed,
            renderCell: (params) => {
                const { row } = params;
                return row?.newest?.closed ? <span className='bad-text bold'>是</span> : <span className='best-text bold'>否</span>;
            },
        },
        {
            field: 'lastValue',
            headerName: '前量',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 60,
            width: 60,
            valueGetter: (params) => {
                const { row } = params;
                return row?.newest?.lastValue;
            },
            renderCell: (params) => {
                const { row } = params;
                return row?.newest?.lastValue;
            },
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
                        <Tooltip title={'跳空明細'} placement='bottom'>
                            <RemoveRedEye className='action-icon primary mr-2' onClick={() => showRecord(params.row)} />
                        </Tooltip>
                        {actionPermission ? (
                            <Tooltip title={'刪除'} placement='bottom'>
                                <Delete className='action-icon warning' onClick={() => deleteHandler(params.row)} />
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
