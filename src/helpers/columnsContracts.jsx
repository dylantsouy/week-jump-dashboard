import { Tooltip } from '@mui/material';
import { RenderCellExpand } from '@/components/RenderCellExpand';
import { Link } from 'react-router-dom';
import { Billion, Dog } from '@/assets/icons';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';

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
                        <Tooltip title={'合約負債'} placement='bottom'>
                            <Link target='_blank' to={`https://www.istock.tw/stock/${params?.row?.code}/contract-liability`}>
                                <ShowChartIcon className='action-icon primary mr-2' />
                            </Link>
                        </Tooltip>
                        <Tooltip title={'股權結構'} placement='bottom'>
                            <Link target='_blank' to={`https://norway.twsthr.info/StockHolders.aspx?stock=${params?.row?.code}`}>
                                <BarChartIcon className='action-icon primary mr-2' />
                            </Link>
                        </Tooltip>
                        <Tooltip title={'財務分析'} placement='bottom'>
                            <Link target='_blank' to={`https://www.findbillion.com/twstock/${params?.row?.code}/financial_statement`}>
                                <Billion className='action-icon primary mr-2' />
                            </Link>
                        </Tooltip>
                        <Tooltip title={'財報狗'} placement='bottom'>
                            <Link target='_blank' to={`https://statementdog.com/analysis/${params?.row?.code}`}>
                                <Dog className='action-icon primary mr-2' />
                            </Link>
                        </Tooltip>
                    </div>
                );
            },
        },
    ];
};
