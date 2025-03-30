import { jumpTypeMapping, profitHandler } from './format';
import { Tooltip } from '@mui/material';
import { Delete } from '@mui/icons-material';
import moment from 'moment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ActionButtons from '@/components/ActionButtons';
import MultiLineHeader from './MultiLineHeader';

export const listColumn = (showRecord, deleteHandler, actionPermission) => {
    return [
        {
            field: 'name',
            headerName: '股票',
            width: 100,
            valueGetter: (params) => `${params.data.Stock.code} ${params.data.Stock.name}`,
            pinned: 'left',
            cellRenderer: (params) => {
                const { data } = params;
                return (
                    <div className='column_center_center'>
                        <div>{data?.Stock?.name}</div>
                        <a href={`https://www.wantgoo.com/stock/${data?.Stock?.code}/technical-chart`} target='_blank' rel='noreferrer'>
                            {data?.Stock?.code}
                        </a>
                    </div>
                );
            },
        },
        {
            field: 'industry',
            headerName: '產業',
            width: 90,
            valueGetter: (params) => params.data.Stock.industry,
            cellRenderer: (params) => {
                const { data } = params;
                return data?.Stock?.industry;
            },
        },
        {
            field: 'jumpCount_w',
            headerName: '周跳次數',
            headerComponent: MultiLineHeader,
            headerComponentParams: {
                text: (
                    <div className='column_center_center'>
                        <div>周跳</div>
                        <div>未補 / 總數</div>
                    </div>
                ),
            },
            width: 78,
            valueGetter: (params) => {
                const { data } = params;
                return `'${data?.details.jumpCount_w - data?.details.jumpCount_w_c} / ${data?.details.jumpCount_w}`;
            },
            cellRenderer: (params) => {
                const { data } = params;
                return `${data?.details.jumpCount_w - data?.details.jumpCount_w_c} / ${data?.details.jumpCount_w}`;
            },
        },
        {
            field: 'jumpCount_m',
            headerName: '月跳次數',
            headerComponent: MultiLineHeader,
            headerComponentParams: {
                text: (
                    <div className='column_center_center'>
                        <div>月跳</div>
                        <div>未補 / 總數</div>
                    </div>
                ),
            },
            width: 78,
            valueGetter: (params) => {
                const { data } = params;
                return `'${data?.details.jumpCount_m - data?.details.jumpCount_m_c} / ${data?.details.jumpCount_m}`;
            },
            cellRenderer: (params) => {
                const { data } = params;
                return `${data?.details.jumpCount_m - data?.details.jumpCount_m_c} / ${data?.details.jumpCount_m}`;
            },
        },
        {
            field: 'newestDate',
            headerName: '日期',
            width: 80,
            valueGetter: (params) => {
                const { data } = params;
                return data?.newest?.date ? moment(data?.newest?.date).format('YYYY/MM/DD') : '';
            },
            cellRenderer: (params) => {
                const { data } = params;
                return data?.newest?.date ? moment(data?.newest?.date).format('YYYY/MM/DD') : '';
            },
        },
        {
            field: 'newestType',
            headerName: '類型',
            width: 56,
            valueGetter: (params) => {
                const { data } = params;
                const map = {
                    d: '日',
                    w: '周',
                    m: '月',
                };

                return map[data?.newest?.type];
            },
            cellRenderer: (params) => {
                const { data } = params;
                return jumpTypeMapping(data?.newest?.type);
            },
        },
        {
            field: 'jumpPrice',
            headerName: '開盤價',
            width: 80,
            valueGetter: (params) => params.data.newest.jumpPrice,
            cellRenderer: (params) => {
                const { data } = params;
                return data?.newest?.jumpPrice;
            },
        },
        {
            field: 'price',
            headerName: '現價',
            width: 80,
            valueGetter: (params) => params.data.Stock.price,
            cellRenderer: (params) => {
                const { data } = params;
                return data?.Stock?.price;
            },
        },
        {
            field: 'newestLastPrice',
            headerName: '補上價格',
            width: 80,
            valueGetter: (params) => params.data.newest.lastPrice,
            cellRenderer: (params) => {
                const { data } = params;
                return data?.newest?.lastPrice;
            },
        },
        {
            field: 'gap',
            headerName: '距離',
            width: 60,
            valueGetter: (params) => {
                const { data } = params;
                const gap = +(+data?.Stock?.price - data?.newest?.lastPrice).toFixed(2);
                return gap > 0 ? gap : '-';
            },
            cellRenderer: (params) => {
                const { data } = params;
                const gap = +(+data?.Stock?.price - data?.newest?.lastPrice).toFixed(2);
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
                const gap = Math.round((((data?.Stock?.price - data?.newest?.lastPrice) / data?.newest?.lastPrice) * 100 + Number.EPSILON) * 10) / 10;
                return gap;
            },
            cellRenderer: (params) => {
                const { data } = params;
                const gap = Math.round((((data?.Stock?.price - data?.newest?.lastPrice) / data?.newest?.lastPrice) * 100 + Number.EPSILON) * 10) / 10;
                return gap > 0 ? profitHandler(gap) : '-';
            },
        },
        {
            field: 'newestClosed',
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
            width: 60,
            valueGetter: (params) => {
                const { data } = params;
                return data?.newest?.closed ? '是' : '否';
            },
            cellRenderer: (params) => {
                const { data } = params;
                return data?.newest?.closed ? <span className='bad-text bold'>是</span> : <span className='best-text bold'>否</span>;
            },
        },
        {
            field: 'lastValue',
            headerName: '前量',
            width: 60,
            valueGetter: (params) => {
                const { data } = params;
                return data?.newest?.lastValue;
            },
            cellRenderer: (params) => {
                const { data } = params;
                return data?.newest?.lastValue;
            },
        },
        {
            field: 'action',
            headerName: '操作',
            minWidth: 280,
            flex: 1,
            headerClass: 'left',
            cellClass: 'left',
            sortable: false,
            cellRenderer: (params) => {
                return (
                    <div className='action'>
                        {actionPermission ? (
                            <Tooltip title={'刪除'} placement='bottom'>
                                <Delete className='action-icon warning mr-2' onClick={() => deleteHandler(params.data)} />
                            </Tooltip>
                        ) : (
                            <Tooltip title={'沒有權限'} placement='bottom'>
                                <Delete className='action-icon disabled mr-2' />
                            </Tooltip>
                        )}
                        <Tooltip title={'跳空歷史'} placement='bottom'>
                            <ReceiptLongIcon className='action-icon primary mr-2' onClick={() => showRecord(params.data)} />
                        </Tooltip>
                        <ActionButtons code={params?.data?.code} />
                    </div>
                );
            },
        },
    ];
};
