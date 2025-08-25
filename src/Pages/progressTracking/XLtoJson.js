import React, { useState } from 'react';
import * as XLSX from 'xlsx';
const ExcelCSVToJsonConverter = () => {
  const [jsonData, setJsonData] = useState(null);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
          console.log(e);
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0]; // Assuming only one sheet is present
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      setJsonData(json);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
          {jsonData && (
            setFormData(JSON.stringify(jsonData, null, 2))
        // <pre>{JSON.stringify(jsonData, null, 2)}</pre>
      )}
    </div>
  );
};
export default ExcelCSVToJsonConverter;
