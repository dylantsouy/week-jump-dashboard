import { Tooltip } from '@mui/material';
import { Delete, Edit, RemoveRedEye } from '@mui/icons-material';
import moment from 'moment';
import { dateGap, profitHandler } from './format';
import { RenderCellExpand } from '@/components/RenderCellExpand';

export const listColumn = (showRecord, deleteHandler, editHandler, actionPermission) => {
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
            minWidth: 50,
            width: 50,
            valueGetter: (params) => params.row.code,
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
            field: 'initPrice',
            headerName: '觀察價',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 60,
            width: 60,
            renderCell: RenderCellExpand,
        },
        {
            field: 'price',
            headerName: '收盤價',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 60,
            width: 60,
            valueGetter: (params) => params.row.price,
            renderCell: (params) => {
                const { row } = params;
                return row?.price;
            },
        },
        {
            field: 'profit',
            headerName: '損益',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 58,
            width: 58,
            renderCell: (params) => {
                const { row } = params;
                const profit = Math.round((((row?.price - row?.initPrice) / row?.initPrice) * 100 + Number.EPSILON) * 10) / 10;
                return profitHandler(profit);
            },
        },
        {
            field: 'createdAt',
            headerName: '觀察日期',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 70,
            width: 70,
            renderCell: (params) => {
                const { row } = params;
                return row?.createdAt ? moment(row?.createdAt).format('YYYY/MM/DD') : '';
            },
            valueGetter: (params) => {
                const { row } = params;
                return row?.createdAt ? moment(row?.createdAt).format('YYYY/MM/DD') : '';
            },
        },
        {
            field: 'gap',
            headerName: '過多久',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>過多久</div>
                    <div>(天)</div>
                </div>
            ),
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 56,
            width: 56,
            editable: false,
            renderCell: (params) => {
                const { row } = params;
                return dateGap(row?.createdAt);
            },
        },
        {
            field: 'observe1Count',
            headerName: '觀察',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>觀察</div>
                    <div>(次)</div>
                </div>
            ),
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 70,
            width: 70,
            renderCell: RenderCellExpand,
        },
        {
            field: 'observe2Count',
            headerName: '稍微觀察',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>稍微觀察</div>
                    <div>(次)</div>
                </div>
            ),
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 70,
            width: 70,
            renderCell: RenderCellExpand,
        },
        {
            field: 'observe3Count',
            headerName: '其他',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>其他</div>
                    <div>(次)</div>
                </div>
            ),
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 70,
            width: 70,
            renderCell: RenderCellExpand,
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
                            <Tooltip title={'編輯'} placement='bottom'>
                                <Edit className='action-icon mr-2' onClick={() => editHandler(params.row)} />
                            </Tooltip>
                        ) : (
                            <Tooltip title={'沒有權限'} placement='bottom'>
                                <Delete className='action-icon disabled mr-2' />
                            </Tooltip>
                        )}
                        {actionPermission ? (
                            <Tooltip title={'刪除'} placement='bottom'>
                                <Delete className='action-icon warning mr-2' onClick={() => deleteHandler(params.row)} />
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
