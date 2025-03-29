import { RenderCellExpand } from '@/components/RenderCellExpand';
import ActionButtons from '@/components/ActionButtons';
import moment from 'moment';
export const listColumn = () => {
    return [
        {
            field: 'initPrice',
            headerName: '股價',
            width: 80,
            cellRenderer: RenderCellExpand,
        },
        {
            field: 'previousBalance',
            headerName: '昨日餘額',
            width: 100,
            cellRenderer: RenderCellExpand,
        },
        {
            field: 'currentBalance',
            headerName: '融資餘額',
            width: 100,
            cellRenderer: RenderCellExpand,
        },
        {
            field: 'currentBalance',
            headerName: '增減張數',
            width: 100,
            cellRenderer: RenderCellExpand,
        },
        {
            field: 'marginRate',
            headerName: '融資使用率',
            width: 100,
            cellRenderer: (params) => {
                const { data } = params;
                return data?.marginRate + '%';
            },
        },
        {
            field: 'marginRateChange',
            headerName: '融資使用率增加',
            width: 120,
            cellRenderer: (params) => {
                const { data } = params;
                return data?.marginRateChange + '%';
            },
        },
        {
            field: 'recordDate',
            headerName: '觀察日期',
            width: 90,
            sort: 'desc',
            cellRenderer: (params) => {
                const { data } = params;
                let date = data?.recordDate;
                return date ? moment(date).format('YYYY/MM/DD') : '';
            },
            valueGetter: (params) => {
                const { data } = params;
                let date = data?.recordDate;
                return date ? moment(date).format('YYYY/MM/DD') : '';
            },
        },
        {
            field: 'action',
            headerName: '操作',
            minWidth: 240,
            flex: 1,
            headerClass: 'left',
            cellClass: 'left',
            sortable: false,
            cellRenderer: (params) => {
                return (
                    <div className='action'>
                        <ActionButtons code={params?.data?.stockCode} />
                    </div>
                );
            },
        },
    ];
};
