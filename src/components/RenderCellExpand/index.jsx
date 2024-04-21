import * as React from 'react';
import { Paper, Popper } from '@mui/material';
import './styles.scss';

const CellExpand = React.memo(function CellExpand(props) {
    const { width, value } = props;
    const wrapper = React.useRef(null);
    const cellDiv = React.useRef(null);
    const cellValue = React.useRef(null);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const [showFullCell, setShowFullCell] = React.useState(false);
    const [showPopper, setShowPopper] = React.useState(false);

    const showCell = React.useCallback(() => {
        setShowFullCell(true);
    }, []);
    const hideCell = React.useCallback(() => {
        setShowFullCell(false);
    }, []);

    React.useEffect(() => {
        if (cellDiv.current) {
            setAnchorEl(cellDiv.current);
        }
    }, []);
    React.useEffect(() => {
        if (cellValue && cellValue.current) {
            const isCurrentlyOverflown = isOverflown(cellValue.current);
            setShowPopper(isCurrentlyOverflown);
        }
    }, [width]);

    function isOverflown(element) {
        return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
    }

    return (
        <div ref={wrapper} className='RenderCellExpand' data-testid='expanded-cell' onMouseEnter={showCell} onMouseLeave={hideCell}>
            <div
                ref={cellDiv}
                style={{
                    height: 1,
                    width,
                    display: 'block',
                    position: 'absolute',
                }}
            />
            <div ref={cellValue} className='cellValue'>
                {value}
            </div>
            {showPopper && (
                <Popper id={'123'} open={showFullCell && anchorEl != null} anchorEl={anchorEl} style={{ marginLeft: -17 }}>
                    <Paper elevation={1}>
                        <div
                            style={{
                                padding: 5,
                                background: '#777',
                                color: '#fff',
                                fontSize: 12,
                                borderRadius: 5,
                            }}
                        >
                            {value}
                        </div>
                    </Paper>
                </Popper>
            )}
        </div>
    );
});

export function RenderCellExpand(params) {
    return <CellExpand value={params.value ? params.value.toString() : '-'} width={params.colDef.width} />;
}
