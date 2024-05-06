import { Tooltip } from '@mui/material';
import { Delete } from '@mui/icons-material';
import moment from 'moment';

export const listColumn = (deleteHandler, actionPermission, recordData) => {
    return [
        {
            field: 'date',
            headerName: '日期',
            align: 'center',
            headerAlign: 'center',
            minWidth: 80,
            width: 80,
            renderCell: (params) => {
                const { row } = params;
                return row?.date ? moment(row?.date).format('YYYY/MM/DD') : '';
            },
        },
        {
            field: 'jumpPrice',
            headerName: '開盤價',
            align: 'center',
            headerAlign: 'center',
            minWidth: 60,
            width: 60,
        },
        {
            field: 'price',
            headerName: '現價',
            align: 'center',
            headerAlign: 'center',
            minWidth: 60,
            width: 60,
            valueGetter: () => recordData.Stock.price,
            renderCell: () => {
                return recordData?.Stock?.price;
            },
        },
        {
            field: 'lastPrice',
            headerName: '補上價格',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>補上</div>
                    <div>價格</div>
                </div>
            ),
            align: 'center',
            headerAlign: 'center',
            minWidth: 60,
            width: 60,
        },
        {
            field: 'gap',
            headerName: '距離',
            align: 'center',
            headerAlign: 'center',
            minWidth: 60,
            width: 60,
            valueGetter: (params) => {
                const { row } = params;
                const gap = +(+recordData?.Stock?.price - row?.lastPrice).toFixed(2);
                return gap > 0 ? gap : '-';
            },
            renderCell: (params) => {
                const { row } = params;
                const gap = +(+recordData?.Stock?.price - row?.lastPrice).toFixed(2);
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
            minWidth: 60,
            width: 60,
            valueGetter: (params) => {
                const { row } = params;
                const gap = +(+recordData?.Stock?.price - row?.lastPrice).toFixed(2);
                return gap > 0 ? +((gap / row?.Stock?.price) * 100) : -1;
            },
            renderCell: (params) => {
                const { row } = params;
                const gap = +(+recordData?.Stock?.price - row?.lastPrice).toFixed(2);
                return gap > 0 ? `${+((gap / recordData?.Stock?.price) * 100).toFixed(2)}%` : '-';
            },
        },
        {
            field: 'closed',
            headerName: '是否補上',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>是否</div>
                    <div>補上</div>
                </div>
            ),
            align: 'center',
            headerAlign: 'center',
            minWidth: 60,
            width: 60,
            renderCell: (params) => {
                const { row } = params;
                return row?.closed ? <span className='bad-text bold'>是</span> : <span className='best-text bold'>否</span>;
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
