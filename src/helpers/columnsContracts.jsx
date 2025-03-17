import { RenderCellExpand } from '@/components/RenderCellExpand';
import ActionButtons from '@/components/ActionButtons';

export const listColumn = () => {
    return [
        {
            field: 'name',
            headerName: '名稱',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 80,
            width: 80,
            renderCell: RenderCellExpand,
        },
        {
            field: 'industry',
            headerName: '產業',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 70,
            width: 70,
            renderCell: RenderCellExpand,
        },
        {
            field: 'code',
            headerName: '代碼',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 60,
            width: 60,
            valueGetter: (params) => params?.row?.code,
            renderCell: (params) => {
                const { row } = params;
                return (
                    <a href={`https://tw.stock.yahoo.com/quote/${row?.code}.TW/technical-analysis`} target='_blank' rel='noreferrer'>
                        {row?.code}
                    </a>
                );
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
            renderCell: RenderCellExpand,
        },
        {
            field: 'contractValue',
            headerName: '合約負債',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 100,
            width: 100,
            valueGetter: (params) => params?.row?.ContractsRecords?.contractValue,
            renderCell: (params) => {
                const { row } = params;
                return row?.ContractsRecords?.contractValue + ' 億';
            },
        },
        {
            field: 'percentage',
            headerName: '佔股本',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 90,
            width: 90,
            valueGetter: (params) => params?.row?.ContractsRecords?.percentage,
            renderCell: (params) => {
                const { row } = params;
                return row?.ContractsRecords?.percentage + '%';
            },
        },
        {
            field: 'qoq',
            headerName: 'QoQ',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 90,
            width: 90,
            valueGetter: (params) => params?.row?.ContractsRecords?.qoq,
            renderCell: (params) => {
                const { row } = params;
                return row?.ContractsRecords?.qoq + '%';
            },
        },
        {
            field: 'yoy',
            headerName: 'YoY',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 90,
            width: 90,
            valueGetter: (params) => params?.row?.ContractsRecords?.yoy,
            renderCell: (params) => {
                const { row } = params;
                return row?.ContractsRecords?.yoy + '%';
            },
        },
        {
            field: 'quarter',
            headerName: '季度',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 90,
            width: 90,
            valueGetter: (params) => params?.row?.ContractsRecords?.quarter,
            renderCell: (params) => {
                const { row } = params;
                return row?.ContractsRecords?.quarter;
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
                        <ActionButtons code={params?.row?.code} />
                    </div>
                );
            },
        },
    ];
};
