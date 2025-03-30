import { RenderCellExpand } from '@/components/RenderCellExpand';
import ActionButtons from '@/components/ActionButtons';
import moment from 'moment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Tooltip } from '@mui/material';

export const listColumn = (showRecord) => {
    return [
        {
            field: 'stockName',
            headerName: '股票',
            width: 100,
            valueGetter: (params) => `${params.data.stockCode} ${params.data.stockName}`,
            pinned: 'left',
            cellRenderer: (params) => {
                const { data } = params;
                return (
                    <div className='column_center_center'>
                        <div>{data?.stockName}</div>
                        <a href={`https://www.wantgoo.com/stock/${data?.stockCode}/technical-chart`} target='_blank' rel='noreferrer'>
                            {data?.stockCode}
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
            field: 'price',
            headerName: '現價',
            width: 80,
            cellRenderer: RenderCellExpand,
        },
        {
            field: 'previousBalance',
            headerName: '昨日餘額',
            width: 100,
            valueGetter: (params) => params?.data?.latestRecord?.previousBalance,
            cellRenderer: (params) => {
                const { data } = params;
                return data?.latestRecord?.previousBalance;
            },
        },
        {
            field: 'currentBalance',
            headerName: '融資餘額',
            width: 100,
            valueGetter: (params) => params?.data?.latestRecord?.currentBalance,
            cellRenderer: (params) => {
                const { data } = params;
                return data?.latestRecord?.currentBalance;
            },
        },
        {
            field: 'currentBalance',
            headerName: '增減張數',
            width: 100,
            valueGetter: (params) => params?.data?.latestRecord?.change,
            cellRenderer: (params) => {
                const { data } = params;
                return data?.latestRecord?.change;
            },
        },
        {
            field: 'marginRate',
            headerName: '融資使用率',
            width: 100,
            valueGetter: (params) => params?.data?.latestRecord?.marginRate,
            cellRenderer: (params) => {
                const { data } = params;
                return data?.latestRecord?.marginRate + '%';
            },
        },
        {
            field: 'marginRateChange',
            headerName: '融資使用率增加',
            width: 120,
            sort: 'desc',
            valueGetter: (params) => params?.data?.latestRecord?.marginRateChange,
            cellRenderer: (params) => {
                const { data } = params;
                return data?.latestRecord?.marginRateChange + '%';
            },
        },
        {
            field: 'recordDate',
            headerName: '最新觀察日期',
            width: 90,
            cellRenderer: (params) => {
                const { data } = params;
                let date = data?.latestRecord?.recordDate;
                return date ? moment(date).format('YYYY/MM/DD') : '';
            },
            valueGetter: (params) => {
                const { data } = params;
                let date = data?.latestRecord?.recordDate;
                return date ? moment(date).format('YYYY/MM/DD') : '';
            },
        },
        {
            field: 'action',
            headerName: '操作',
            minWidth: 210,
            flex: 1,
            headerClass: 'left',
            cellClass: 'left',
            sortable: false,
            cellRenderer: (params) => {
                return (
                    <div className='action'>
                        <Tooltip title={'融資增加歷史'} placement='bottom'>
                            <ReceiptLongIcon className='action-icon primary mr-2' onClick={() => showRecord(params.data)} />
                        </Tooltip>
                        <ActionButtons code={params?.data?.stockCode} />
                    </div>
                );
            },
        },
    ];
};
