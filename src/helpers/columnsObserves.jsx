import { Tooltip } from '@mui/material';
import { Delete } from '@mui/icons-material';
import moment from 'moment';
import { dateGap, observeReasonMapping, observeTypeMapping, profitHandler } from './format';
import { RenderCellExpand } from '@/components/RenderCellExpand';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ActionButtons from '@/components/ActionButtons';

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
            headerName: '初始價',
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
            headerName: '首次觀察',
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 100,
            width: 100,
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
            field: 'typeCount1',
            headerName: '冷水',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>冷水</div>
                    <div>(次)</div>
                </div>
            ),
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 50,
            width: 50,
            valueGetter: (params) => params?.row?.typeCount?.[1],
            renderCell: (params) => {
                const { row } = params;
                return row?.params?.row?.typeCount?.[1];
            },
        },
        {
            field: 'typeCount2',
            headerName: '溫水',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>溫水</div>
                    <div>(次)</div>
                </div>
            ),
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 50,
            width: 50,
            valueGetter: (params) => params?.row?.typeCount?.[2],
            renderCell: (params) => {
                const { row } = params;
                return row?.params?.row?.typeCount?.[2];
            },
        },
        {
            field: 'typeCount3',
            headerName: '熱水',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>熱水</div>
                    <div>(次)</div>
                </div>
            ),
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'border-cell',
            minWidth: 50,
            width: 50,
            valueGetter: (params) => params?.row?.typeCount?.[3],
            renderCell: (params) => {
                const { row } = params;
                return row?.params?.row?.typeCount?.[3];
            },
        },
        {
            field: 'latestDate',
            headerName: '最新觀察',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>最新</div>
                    <div>觀察</div>
                </div>
            ),
            cellClassName: 'border-cell',
            align: 'center',
            headerAlign: 'center',
            minWidth: 100,
            width: 100,
            valueGetter: (params) => params.row.latestRecord.date,
            renderCell: (params) => {
                const { row } = params;
                return row?.latestRecord?.date ? moment(row?.latestRecord?.date).format('YYYY/MM/DD') : '';
            },
        },
        {
            field: 'latestType',
            headerName: '最新類別',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>最新</div>
                    <div>類別</div>
                </div>
            ),
            cellClassName: 'border-cell',
            align: 'center',
            headerAlign: 'center',
            minWidth: 60,
            width: 60,
            renderCell: (params) => {
                const { row } = params;
                return observeTypeMapping(row?.latestRecord?.type);
            },
        },
        {
            field: 'latestReason',
            headerName: '最新位階',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>最新</div>
                    <div>位階</div>
                </div>
            ),
            align: 'center',
            headerAlign: 'center',
            cellClassName: 'cell-wrap border-cell',
            minWidth: 150,
            width: 150,
            renderCell: (params) => {
                const { row } = params;
                return observeReasonMapping(row?.latestRecord?.reason);
            },
        },
        {
            field: 'latestPrice',
            headerName: '最新價格',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>最新</div>
                    <div>價格</div>
                </div>
            ),
            cellClassName: 'border-cell',
            align: 'center',
            headerAlign: 'center',
            minWidth: 60,
            width: 60,
            renderCell: (params) => {
                const { row } = params;
                return row?.latestRecord?.price;
            },
        },
        {
            field: 'latestProfit',
            headerName: '最新損益',
            renderHeader: () => (
                <div className='column_center_center'>
                    <div>最新</div>
                    <div>損益</div>
                </div>
            ),
            cellClassName: 'border-cell',
            align: 'center',
            headerAlign: 'center',
            minWidth: 58,
            width: 58,
            renderCell: (params) => {
                const { row } = params;
                const profit = Math.round((((row?.price - row?.latestRecord?.price) / row?.latestRecord?.price) * 100 + Number.EPSILON) * 10) / 10;
                return profitHandler(profit);
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
                        {actionPermission ? (
                            <Tooltip title={'刪除'} placement='bottom'>
                                <Delete className='action-icon warning mr-2' onClick={() => deleteHandler(params.row)} />
                            </Tooltip>
                        ) : (
                            <Tooltip title={'沒有權限'} placement='bottom'>
                                <Delete className='action-icon disabled mr-2' />
                            </Tooltip>
                        )}
                        <Tooltip title={'動能歷史'} placement='bottom'>
                            <ReceiptLongIcon className='action-icon primary mr-2' onClick={() => showRecord(params.row)} />
                        </Tooltip>
                        {/* {actionPermission ? (
                            <Tooltip title={'編輯'} placement='bottom'>
                                <Edit className='action-icon mr-2' onClick={() => editHandler(params.row)} />
                            </Tooltip>
                        ) : (
                            <Tooltip title={'沒有權限'} placement='bottom'>
                                <Delete className='action-icon disabled mr-2' />
                            </Tooltip>
                        )} */}
                        <ActionButtons code={params?.row?.code} />
                    </div>
                );
            },
        },
    ];
};
