import { Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { Billion, Dog } from '@/assets/icons';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import ReduceCapacityIcon from '@mui/icons-material/ReduceCapacity';
import HandshakeIcon from '@mui/icons-material/Handshake';
import './index.scss';

export default function ActionButtons(props) {
    const { code } = props;

    return (
        <>
            <Tooltip title={'合約負債'} placement='bottom'>
                <Link target='_blank' to={`https://www.istock.tw/stock/${code}/contract-liability`}>
                    <HandshakeIcon className='action-icon primary mr-2' />
                </Link>
            </Tooltip>
            <Tooltip title={'股權結構'} placement='bottom'>
                <Link target='_blank' to={`https://norway.twsthr.info/StockHolders.aspx?stock=${code}`}>
                    <ReduceCapacityIcon className='action-icon primary mr-2' />
                </Link>
            </Tooltip>
            <Tooltip title={'法說會'} placement='bottom'>
                <Link target='_blank' to={`https://agdstock.club/iic/${code}`}>
                    <CoPresentIcon className='action-icon primary mr-2' />
                </Link>
            </Tooltip>
            <Tooltip title={'財務分析'} placement='bottom'>
                <Link target='_blank' to={`https://www.findbillion.com/twstock/${code}/financial_statement`}>
                    <Billion className='action-icon primary mr-2' />
                </Link>
            </Tooltip>
            <Tooltip title={'財報狗'} placement='bottom'>
                <Link target='_blank' to={`https://statementdog.com/analysis/${code}`}>
                    <Dog className='action-icon primary mr-2' />
                </Link>
            </Tooltip>
        </>
    );
}
