import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [data, setData] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleImportClick = () => {
    if (!selectedFile) {
      alert('Please select a file to import.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    axios.post('http://localhost:3000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      setData(response.data);
      alert('File uploaded successfully.');
    }).catch(error => {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    });
  };


    const handleExportClick = () => {
      axios.get('http://localhost:3000/export', {
        responseType: 'blob' // Set responseType to 'blob' to receive binary data
      })
      .then(response => {
        // Create a blob from the binary data
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
        // Create a link element
        const link = document.createElement('a');
        // Set the href attribute of the link to the URL of the blob
        link.href = url;
        // Set the download attribute of the link to specify the filename
        link.download = 'products.xlsx';
        // Append the link to the document body
        document.body.appendChild(link);
        
        link.click();
        
        document.body.removeChild(link);
      })
      .catch(error => {
        console.error('Error exporting data:', error);
      });
    };

  return (
    <div>
      <input type="file" onChange={handleFileChange} /><br/> <br/>
      <button onClick={handleImportClick}>Import File</button><br/> <br/>
      <button onClick={handleExportClick}>Export Data</button><br/> <br/>
      {data.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(data[0]).map(key => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {Object.values(item).map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FileUpload;
