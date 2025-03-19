import { Tooltip } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import moment from 'moment';
import { dateGap, observeReasonMapping, observeTypeMapping, profitHandler } from './format';
import { RenderCellExpand } from '@/components/RenderCellExpand';

export const listColumn = (deleteHandler, editHandler, actionPermission, recordData) => {
    return [
        {
            field: 'type',
            headerName: '類型',
            width: 60,
            cellRenderer: (params) => {
                const { data } = params;
                return observeTypeMapping(data?.type);
            },
        },
        {
            field: 'reason',
            headerName: '位階',
            width: 150,
            cellRenderer: (params) => {
                const { data } = params;
                return observeReasonMapping(data?.reason);
            },
        },
        {
            field: 'price',
            headerName: '觀察價',
            width: 80,
            cellRenderer: RenderCellExpand,
        },
        {
            field: 'priceNow',
            headerName: '收盤價',
            width: 80,
            valueGetter: () => recordData.price,
            cellRenderer: () => {
                return recordData?.price;
            },
        },
        {
            field: 'profit',
            headerName: '損益',
            width: 70,
            cellRenderer: (params) => {
                const { data } = params;
                const profit = Math.round((((recordData?.price - data?.price) / data?.price) * 100 + Number.EPSILON) * 10) / 10;
                return profitHandler(profit);
            },
        },
        {
            field: 'date',
            headerName: '觀察日期',
            width: 90,
            cellRenderer: (params) => {
                const { data } = params;
                return data?.date ? moment(data?.date).format('YYYY/MM/DD') : '';
            },
            valueGetter: (params) => {
                const { data } = params;
                return data?.date ? moment(data?.date).format('YYYY/MM/DD') : '';
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
            width: 56,
            cellRenderer: (params) => {
                const { data } = params;
                return dateGap(data?.date);
            },
        },
        {
            field: 'action',
            headerName: '操作',
            minWidth: 50,
            flex: 1,
            headerClass: 'left',
            cellClass: 'left',
            cellRenderer: (params) => {
                return (
                    <div className='action'>
                        {actionPermission ? (
                            <Tooltip title={'編輯'} placement='bottom'>
                                <Edit className='action-icon mr-2' onClick={() => editHandler(params.data)} />
                            </Tooltip>
                        ) : (
                            <Tooltip title={'沒有權限'} placement='bottom'>
                                <Delete className='action-icon disabled mr-2' />
                            </Tooltip>
                        )}
                        {actionPermission ? (
                            <Tooltip title={'刪除'} placement='bottom'>
                                <Delete className='action-icon warning' onClick={() => deleteHandler(params.data)} />
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
