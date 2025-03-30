import { RenderCellExpand } from '@/components/RenderCellExpand';
import ActionButtons from '@/components/ActionButtons';

export const listColumn = () => {
    return [
        {
            field: 'name',
            headerName: '股票',
            width: 100,
            valueGetter: (params) => `${params.data.code} ${params.data.name}`,
            pinned: 'left',
            cellRenderer: (params) => {
                const { data } = params;
                return (
                    <div className='column_center_center'>
                        <div>{data?.name}</div>
                        <a href={`https://www.wantgoo.com/stock/${data?.code}/technical-chart`} target='_blank' rel='noreferrer'>
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
            valueGetter: (params) => params?.data?.ContractsRecords?.contractValue + ' 億',
            comparator: (valueA, valueB, nodeA, nodeB) => {
                let a = nodeA?.data?.ContractsRecords?.contractValue;
                let b = nodeB?.data?.ContractsRecords?.contractValue;
                return a > b ? 1 : -1;
            },
            cellRenderer: (params) => {
                const { data } = params;
                return data?.ContractsRecords?.contractValue + ' 億';
            },
        },
        {
            field: 'percentage',
            headerName: '佔股本',
            width: 80,
            valueGetter: (params) => params?.data?.ContractsRecords?.percentage + '%',
            comparator: (valueA, valueB, nodeA, nodeB) => {
                let a = nodeA?.data?.ContractsRecords?.percentage;
                let b = nodeB?.data?.ContractsRecords?.percentage;
                return a > b ? 1 : -1;
            },
            cellRenderer: (params) => {
                const { data } = params;
                return data?.ContractsRecords?.percentage + '%';
            },
        },
        {
            field: 'qoq',
            headerName: 'QoQ',
            sort: 'desc',
            width: 80,
            valueGetter: (params) => params?.data?.ContractsRecords?.qoq + '%',
            comparator: (valueA, valueB, nodeA, nodeB) => {
                let a = nodeA?.data?.ContractsRecords?.qoq;
                let b = nodeB?.data?.ContractsRecords?.qoq;
                return a > b ? 1 : -1;
            },
            cellRenderer: (params) => {
                const { data } = params;
                return data?.ContractsRecords?.qoq + '%';
            },
        },
        {
            field: 'yoy',
            headerName: 'YoY',
            width: 80,
            valueGetter: (params) => params?.data?.ContractsRecords?.yoy + '%',
            comparator: (valueA, valueB, nodeA, nodeB) => {
                let a = nodeA?.data?.ContractsRecords?.yoy;
                let b = nodeB?.data?.ContractsRecords?.yoy;
                return a > b ? 1 : -1;
            },
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
            minWidth: 210,
            flex: 1,
            headerClass: 'left',
            cellClass: 'left',
            sortable: false,
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
