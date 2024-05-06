import { jumpTypeMapping } from './format';
import { Tooltip } from '@mui/material';
import { Delete, RemoveRedEye } from '@mui/icons-material';
import moment from 'moment';

export const listColumn = (showRecord, deleteHandler, actionPermission) => {
    return [
        {
            field: 'name',
            headerName: '名稱',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 80,
            width: 80,
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
            minWidth: 58,
            width: 58,
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
            field: 'price',
            headerName: '收盤價',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 58,
            width: 58,
            renderCell: (params) => {
                const { row } = params;
                return row?.Stock?.price;
            },
        },
        {
            field: 'jumpCount_w',
            headerName: '周跳次數',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>周跳</div>
                    <div>次數</div>
                </div>
            ),
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 58,
            width: 58,
            renderCell: (params) => {
                const { row } = params;
                return row?.jumpCount_w;
            },
        },
        {
            field: 'jumpCount_m',
            headerName: '月跳次數',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>月跳</div>
                    <div>次數</div>
                </div>
            ),
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 58,
            width: 58,
            renderCell: (params) => {
                const { row } = params;
                return row?.jumpCount_m;
            },
        },
        {
            field: 'newestDate',
            headerName: '最新跳空',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>最新</div>
                    <div>跳空</div>
                </div>
            ),
            headerClassName: 'eps2025',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'eps2025',
            minWidth: 80,
            width: 80,
            renderCell: (params) => {
                const { row } = params;
                return row?.newestDate ? moment(row?.newestDate).format('YYYY/MM/DD') : '';
            },
        },
        {
            field: 'newestType',
            headerName: '類型',
            headerClassName: 'eps2025',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'eps2025 border-cell',
            minWidth: 56,
            width: 56,
            renderCell: (params) => {
                const { row } = params;
                return jumpTypeMapping(row?.newest?.type);
            },
        },
        {
            field: 'newestLastPrice',
            headerName: '跳空低點',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>缺口</div>
                    <div>低點</div>
                </div>
            ),
            headerClassName: 'eps2025',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'eps2025',
            minWidth: 60,
            width: 60,
            renderCell: (params) => {
                const { row } = params;
                return row?.newest?.lastPrice;
            },
        },
        {
            field: 'gap',
            headerName: '停損',
            headerClassName: 'eps2025',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'eps2025',
            minWidth: 60,
            width: 60,
            renderCell: (params) => {
                const { row } = params;
                const gap = +(+row?.Stock?.price - row?.newest?.lastPrice).toFixed(2);
                return gap > 0 ? gap : '-';
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
            headerClassName: 'eps2025',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'eps2025',
            minWidth: 60,
            width: 60,
            renderCell: (params) => {
                const { row } = params;
                return row?.newest?.closed ? <span className='bad-text bold'>是</span> : <span className='best-text bold'>否</span>;
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
