import './styles.scss';
import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid';

export default function CustomToolbar() {
    // const generateFileName = () => {
    //     const timestamp = Date.now();
    //     const fileName = `stock_dashboard_${timestamp}`;
    //     return fileName;
    // };

    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            {/* <GridToolbarExport
                csvOptions={{
                    fileName: generateFileName(),
                    utf8WithBom: true,
                    allColumns: true,
                }}
                printOptions={{ disableToolbarButton: true }}
            /> */}
        </GridToolbarContainer>
    );
}
