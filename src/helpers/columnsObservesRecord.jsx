import { Tooltip } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import moment from 'moment';
import { dateGap, observeTypeMapping, profitHandler } from './format';
import { RenderCellExpand } from '@/components/RenderCellExpand';

export const listColumn = (deleteHandler, editHandler, actionPermission, recordData) => {
    return [
        {
            field: 'type',
            headerName: '類型',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 60,
            width: 60,
            renderCell: (params) => {
                const { row } = params;
                return observeTypeMapping(row?.type);
            },
        },
        {
            field: 'price',
            headerName: '觀察價',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 58,
            width: 58,
            renderCell: RenderCellExpand,
        },
        {
            field: 'priceNow',
            headerName: '收盤價',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 60,
            width: 60,
            valueGetter: () => recordData.price,
            renderCell: () => {
                return recordData?.price;
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
                const profit = Math.round((((recordData?.price - row?.price) / row?.price) * 100 + Number.EPSILON) * 10) / 10;
                return profitHandler(profit);
            },
        },
        {
            field: 'date',
            headerName: '觀察日期',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 90,
            width: 90,
            renderCell: (params) => {
                const { row } = params;
                return row?.date ? moment(row?.date).format('YYYY/MM/DD') : '';
            },
            valueGetter: (params) => {
                const { row } = params;
                return row?.date ? moment(row?.date).format('YYYY/MM/DD') : '';
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
                return dateGap(row?.date);
            },
        },
        {
            field: 'reason',
            headerName: '理由',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 58,
            width: 58,
            flex: 1,
            renderCell: RenderCellExpand,
        },
        {
            field: 'action',
            filterable: false,
            sortable: false,
            disableExport: true,
            headerName: '操作',
            minWidth: 130,
            renderCell: (params) => {
                return (
                    <div className='action'>
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
