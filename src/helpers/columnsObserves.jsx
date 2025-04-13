import { Tooltip } from '@mui/material';
import { Delete } from '@mui/icons-material';
import moment from 'moment';
import { dateGap, observeReasonMapping, observeTypeMapping, profitHandler } from './format';
import { RenderCellExpand } from '@/components/RenderCellExpand';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ScreenSearchDesktopIcon from '@mui/icons-material/ScreenSearchDesktop';

export const listColumn = (showRecord, deleteHandler, actionPermission, showFastSearchHandler) => {
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
            field: 'initPrice',
            headerName: '初始價',
            width: 80,
            cellRenderer: RenderCellExpand,
        },
        {
            field: 'price',
            headerName: '收盤價',
            width: 80,
            cellRenderer: RenderCellExpand,
        },
        {
            field: 'profit',
            headerName: '損益',
            width: 70,
            cellRenderer: (params) => {
                const { data } = params;
                const profit = Math.round((((data?.price - data?.initPrice) / data?.initPrice) * 100 + Number.EPSILON) * 10) / 10;
                return profitHandler(profit);
            },
            valueGetter: (params) => {
                const { data } = params;
                const profit = Math.round((((data?.price - data?.initPrice) / data?.initPrice) * 100 + Number.EPSILON) * 10) / 10;
                return profit;
            },
        },
        {
            field: 'createdAt',
            headerName: '首次觀察',
            width: 100,
            cellRenderer: (params) => {
                const { data } = params;
                return data?.createdAt ? moment(data?.createdAt).format('YYYY/MM/DD') : '';
            },
            valueGetter: (params) => {
                const { data } = params;
                return data?.createdAt ? moment(data?.createdAt).format('YYYY/MM/DD') : '';
            },
        },
        {
            field: 'gap',
            headerName: '過多久',
            width: 56,
            editable: false,
            cellRenderer: (params) => {
                const { data } = params;
                return dateGap(data?.createdAt);
            },
            valueGetter: (params) => {
                const { data } = params;
                return dateGap(data?.createdAt);
            },
        },
        {
            field: 'typeCount1',
            headerName: '冷水',
            width: 50,
            valueGetter: (params) => params?.data?.typeCount?.[1],
            cellRenderer: (params) => {
                const { data } = params;
                return data?.typeCount?.[1];
            },
        },
        {
            field: 'typeCount2',
            headerName: '溫水',
            width: 50,
            valueGetter: (params) => params?.data?.typeCount?.[2],
            cellRenderer: (params) => {
                const { data } = params;
                return data?.typeCount?.[2];
            },
        },
        {
            field: 'typeCount3',
            headerName: '熱水',
            width: 50,
            valueGetter: (params) => params?.data?.typeCount?.[3],
            cellRenderer: (params) => {
                const { data } = params;
                return data?.typeCount?.[3];
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
            width: 100,
            valueGetter: (params) => {
                const { data } = params;
                return data?.latestRecord?.date ? moment(data?.latestRecord?.date).format('YYYY/MM/DD') : '';
            },
            cellRenderer: (params) => {
                const { data } = params;
                return data?.latestRecord?.date ? moment(data?.latestRecord?.date).format('YYYY/MM/DD') : '';
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
            width: 60,
            cellRenderer: (params) => {
                const { data } = params;
                return observeTypeMapping(data?.latestRecord?.type);
            },
            valueGetter: (params) => {
                const { data } = params;
                const map = {
                    1: '冷水',
                    2: '溫水',
                    3: '熱水',
                };

                return map[data?.latestRecord?.type];
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
            width: 90,
            cellRenderer: (params) => {
                const { data } = params;
                return observeReasonMapping(data?.latestRecord?.reason);
            },
            valueGetter: (params) => {
                const { data } = params;
                return data?.latestRecord?.reason;
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
            width: 80,
            cellRenderer: (params) => {
                const { data } = params;
                return data?.latestRecord?.price;
            },
            valueGetter: (params) => {
                const { data } = params;
                return data?.latestRecord?.price;
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
            sort: 'desc',
            width: 80,
            cellRenderer: (params) => {
                const { data } = params;
                const profit = Math.round((((data?.price - data?.latestRecord?.price) / data?.latestRecord?.price) * 100 + Number.EPSILON) * 10) / 10;
                return profitHandler(profit);
            },
            valueGetter: (params) => {
                const { data } = params;
                const profit = Math.round((((data?.price - data?.latestRecord?.price) / data?.latestRecord?.price) * 100 + Number.EPSILON) * 10) / 10;
                return profit;
            },
        },
        {
            field: 'action',
            headerName: '操作',
            minWidth: 280,
            flex: 1,
            headerClass: 'left',
            cellClass: 'left',
            sortable: false,
            cellRenderer: (params) => {
                return (
                    <div className='action'>
                        {actionPermission ? (
                            <Tooltip title={'刪除'} placement='bottom'>
                                <Delete className='action-icon warning mr-2' onClick={() => deleteHandler(params.data)} />
                            </Tooltip>
                        ) : (
                            <Tooltip title={'沒有權限'} placement='bottom'>
                                <Delete className='action-icon disabled mr-2' />
                            </Tooltip>
                        )}
                        <Tooltip title={'動能歷史'} placement='bottom'>
                            <ReceiptLongIcon className='action-icon primary mr-2' onClick={() => showRecord(params.data)} />
                        </Tooltip>
                        <Tooltip title={'快速查詢'} placement='bottom'>
                            <ScreenSearchDesktopIcon className='action-icon mr-2' onClick={() => showFastSearchHandler({ code: params?.data?.code, name: params?.data?.name })} />
                        </Tooltip>
                    </div>
                );
            },
        },
    ];
};
