import React from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import { amber } from '@mui/material/colors';

const ExcelExport = ({ data, fileName }) => {
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, `${fileName}.xlsx`);
    };

    return (
        <Tooltip title="Export to Excel">
            <IconButton
                sx={{ backgroundColor: amber[200] }}
                color='info'
                onClick={exportToExcel}
                children={<FileDownloadIcon fontSize='large' />}
            />
        </Tooltip>

    );
}

export default ExcelExport;
