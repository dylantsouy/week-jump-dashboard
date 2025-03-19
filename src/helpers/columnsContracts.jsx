import { RenderCellExpand } from '@/components/RenderCellExpand';
import ActionButtons from '@/components/ActionButtons';

export const listColumn = () => {
    return [
        {
            field: 'name',
            headerName: '股票',
            width: 100,
            valueGetter: (params) => `${params.data.name} ${params.data.code}`,
            pinned: 'left',
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
            field: 'price',
            headerName: '現價',
            width: 80,
            cellRenderer: RenderCellExpand,
        },
        {
            field: 'contractValue',
            headerName: '合約負債',
            width: 100,
            valueGetter: (params) => params?.data?.ContractsRecords?.contractValue,
            cellRenderer: (params) => {
                const { data } = params;
                return data?.ContractsRecords?.contractValue + ' 億';
            },
        },
        {
            field: 'percentage',
            headerName: '佔股本',
            width: 80,
            valueGetter: (params) => params?.data?.ContractsRecords?.percentage,
            cellRenderer: (params) => {
                const { data } = params;
                return data?.ContractsRecords?.percentage + '%';
            },
        },
        {
            field: 'qoq',
            headerName: 'QoQ',
            width: 80,
            valueGetter: (params) => params?.data?.ContractsRecords?.qoq,
            cellRenderer: (params) => {
                const { data } = params;
                return data?.ContractsRecords?.qoq + '%';
            },
        },
        {
            field: 'yoy',
            headerName: 'YoY',
            width: 80,
            valueGetter: (params) => params?.data?.ContractsRecords?.yoy,
            cellRenderer: (params) => {
                const { data } = params;
                return data?.ContractsRecords?.yoy + '%';
            },
        },
        {
            field: 'quarter',
            headerName: '季度',
            width: 80,
            valueGetter: (params) => params?.data?.ContractsRecords?.quarter,
            cellRenderer: (params) => {
                const { data } = params;
                return data?.ContractsRecords?.quarter;
            },
        },
        {
            field: 'action',
            headerName: '操作',
            minWidth: 280,
            flex: 1,
            headerClass: 'left',
            cellClass: 'left',
            cellRenderer: (params) => {
                return (
                    <div className='action'>
                        <ActionButtons code={params?.data?.code} />
                    </div>
                );
            },
        },
    ];
};
