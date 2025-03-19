import { Tooltip } from '@mui/material';
import { Delete } from '@mui/icons-material';
import moment from 'moment';
import MultiLineHeader from './MultiLineHeader';

export const listColumn = (deleteHandler, actionPermission, recordData) => {
    return [
        {
            field: 'date',
            headerName: '日期',
            width: 100,
            valueGetter: (params) => {
                const { data } = params;
                return data?.date ? moment(data?.date).format('YYYY/MM/DD') : '';
            },
            cellRenderer: (params) => {
                const { data } = params;
                return data?.date ? moment(data?.date).format('YYYY/MM/DD') : '';
            },
        },
        {
            field: 'lastValue',
            headerName: '前量',
            width: 70,
            valueGetter: (params) => {
                const { data } = params;
                return data?.lastValue;
            },
            cellRenderer: (params) => {
                const { data } = params;
                return data?.lastValue;
            },
        },
        {
            field: 'jumpPrice',
            headerName: '開盤價',
            width: 70,
        },
        {
            field: 'price',
            headerName: '現價',
            width: 70,
            valueGetter: () => recordData.Stock.price,
            cellRenderer: () => {
                return recordData?.Stock?.price;
            },
        },
        {
            field: 'lastPrice',
            headerName: '補上價格',
            width: 80,
        },
        {
            field: 'gap',
            headerName: '距離',
            width: 60,
            valueGetter: (params) => {
                const { data } = params;
                const gap = +(+recordData?.Stock?.price - data?.lastPrice).toFixed(2);
                return gap > 0 ? gap : '-';
            },
            cellRenderer: (params) => {
                const { data } = params;
                const gap = +(+recordData?.Stock?.price - data?.lastPrice).toFixed(2);
                return gap > 0 ? gap : '-';
            },
        },
        {
            field: 'gapPercent',
            headerName: '距離 (%)',
            width: 78,
            sort: 'desc',
            valueGetter: (params) => {
                const { data } = params;
                const gap = +(+recordData?.Stock?.price - data?.lastPrice).toFixed(2);
                return gap > 0 ? `${+((gap / recordData?.Stock?.price) * 100).toFixed(2)}` : '-';
            },
            cellRenderer: (params) => {
                const { data } = params;
                const gap = +(+recordData?.Stock?.price - data?.lastPrice).toFixed(2);
                return gap > 0 ? `${+((gap / recordData?.Stock?.price) * 100).toFixed(2)}%` : '-';
            },
        },
        {
            field: 'closed',
            headerName: '是否補上',
            headerComponent: MultiLineHeader,
            headerComponentParams: {
                text: (
                    <div className='column_center_center'>
                        <div>是否</div>
                        <div>補上</div>
                    </div>
                ),
            },
            width: 50,
            valueGetter: (params) => {
                const { data } = params;
                return data?.closed ? '是' : '否';
            },
            cellRenderer: (params) => {
                const { data } = params;
                return data?.closed ? <span className='bad-text bold'>是</span> : <span className='best-text bold'>否</span>;
            },
        },
        {
            field: 'action',
            headerName: '操作',
            minWidth: 80,
            flex: 1,
            headerClass: 'left',
            cellClass: 'left',
            sortable: false,
            cellRenderer: (params) => {
                return (
                    <div className='action'>
                        {actionPermission ? (
                            <Tooltip title={'刪除'} placement='bottom'>
                                <Delete className='action-icon warning' onClick={() => deleteHandler(params.data)} />
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
