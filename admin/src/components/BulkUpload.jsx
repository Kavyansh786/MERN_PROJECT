import React, { useState } from 'react';
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';
import axios from 'axios';

const BulkUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [categoryPage, setCategoryPage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const categoryPages = [
    { value: 'rings', label: 'Rings' },
    { value: 'necklaces', label: 'Necklaces' },
    { value: 'earrings', label: 'Earrings' },
    { value: 'bracelets', label: 'Bracelets' },
    { value: 'bridal', label: 'Bridal Collection' },
    { value: 'birthday-gifts', label: 'Birthday Gifts' },
    { value: 'zodiac-jewelry', label: 'Zodiac Jewelry' },
    { value: 'anniversary-gifts', label: 'Anniversary Gifts' },
    { value: 'anniversary', label: 'Anniversary' },
    { value: 'festive-gifts', label: 'Festive Gifts' },
    { value: 'personalized-gifts', label: 'Personalized Gifts' },
    { value: 'raksha-bandhan', label: 'Raksha Bandhan' },
    { value: 'shop', label: 'General Shop' }
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          file.type === 'application/vnd.ms-excel') {
        setSelectedFile(file);
      } else {
        alert('Please select an Excel file (.xlsx or .xls)');
      }
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bulk-upload/template', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'product-upload-template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading template:', error);
      alert('Failed to download template');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select an Excel file');
      return;
    }

    if (!categoryPage) {
      alert('Please select a category page');
      return;
    }

    setUploading(true);
    setUploadResults(null);

    try {
      const formData = new FormData();
      formData.append('excelFile', selectedFile);
      formData.append('categoryPage', categoryPage);

      const response = await axios.post('http://localhost:5000/api/bulk-upload/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUploadResults(response.data);
      setSelectedFile(null);
      
    } catch (error) {
      console.error('Upload error:', error);
      
      // Handle missing headers error specifically
      if (error.response?.data?.missingHeaders) {
        const errorData = error.response.data;
        alert(`Missing Required Column Headers!\n\nMissing: ${errorData.missingHeaders.join(', ')}\n\nRequired columns: ${errorData.requiredHeaders.join(', ')}\n\nPlease download the template and ensure all required columns are present.`);
      } else {
        alert('Failed to upload products: ' + (error.response?.data?.error || error.message));
      }
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setCategoryPage('');
    setUploadResults(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Bulk Product Upload</h1>
        <p className="text-gray-600">Upload multiple products at once using an Excel file</p>
      </div>

      {/* Instructions Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-3">
          <Info className="text-blue-600 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">Instructions for Excel File</h3>
            <div className="text-blue-700 space-y-2">
              <p><strong>Required Fields:</strong> name, price, category, material, imageUrl, description, sku</p>
              <p><strong>Optional Fields:</strong> stone, model3d, isPersonalized, customization options, stock fields</p>
              <p><strong>Boolean Fields:</strong> Use TRUE/FALSE for: isPersonalized, engraving, nameText, inStock, isRakhi, isFeatured, isNewArrival</p>
              <p><strong>Array Fields:</strong> Use comma-separated values for: fontStyle, metalFinish</p>
              <p><strong>SKU:</strong> Must be unique across all products</p>
              <p><strong>File Size:</strong> Maximum 10MB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Template Download */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Download Excel Template</h3>
            <p className="text-gray-600">Get the properly formatted Excel template with sample data</p>
          </div>
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={20} />
            Download Template
          </button>
        </div>
      </div>

      {/* Upload Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Products</h3>
        
        {/* Category Page Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Category Page *
          </label>
          <select
            value={categoryPage}
            onChange={(e) => setCategoryPage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Choose a category page...</option>
            {categoryPages.map(page => (
              <option key={page.value} value={page.value}>
                {page.label}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            All products in the Excel file will be assigned to this category page
          </p>
        </div>

        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
            id="excel-upload"
          />
          
          {selectedFile ? (
            <div className="flex items-center justify-center gap-3">
              <FileSpreadsheet className="text-green-600" size={32} />
              <div>
                <p className="font-medium text-gray-800">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-red-600 hover:text-red-700"
              >
                <XCircle size={20} />
              </button>
            </div>
          ) : (
            <label htmlFor="excel-upload" className="cursor-pointer">
              <Upload className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drop your Excel file here or click to browse
              </p>
              <p className="text-gray-500">
                Supports .xlsx and .xls files up to 10MB
              </p>
            </label>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleUpload}
            disabled={!selectedFile || !categoryPage || uploading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload size={20} />
                Upload Products
              </>
            )}
          </button>
          
          {(selectedFile || uploadResults) && (
            <button
              onClick={resetUpload}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Upload Results */}
      {uploadResults && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Results</h3>
          
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Info className="text-blue-600" size={20} />
                <span className="font-medium text-blue-800">Total</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{uploadResults.summary.total}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-600" size={20} />
                <span className="font-medium text-green-800">Successful</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{uploadResults.summary.successful}</p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <XCircle className="text-red-600" size={20} />
                <span className="font-medium text-red-800">Failed</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{uploadResults.summary.failed}</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-yellow-600" size={20} />
                <span className="font-medium text-yellow-800">Duplicates</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">{uploadResults.summary.duplicates}</p>
            </div>
          </div>

          {/* Detailed Results */}
          {(uploadResults.results.failed.length > 0 || uploadResults.results.duplicates.length > 0) && (
            <div className="space-y-4">
              {/* Failed Products */}
              {uploadResults.results.failed.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-800 mb-2">Failed Products</h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-60 overflow-y-auto">
                    {uploadResults.results.failed.map((item, index) => (
                      <div key={index} className="mb-2 last:mb-0">
                        <p className="text-sm text-red-700">
                          <strong>Row {item.row}:</strong> {item.error}
                        </p>
                        <p className="text-xs text-red-600">Product: {item.data.name || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Duplicate Products */}
              {uploadResults.results.duplicates.length > 0 && (
                <div>
                  <h4 className="font-medium text-yellow-800 mb-2">Duplicate Products</h4>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-h-60 overflow-y-auto">
                    {uploadResults.results.duplicates.map((item, index) => (
                      <div key={index} className="mb-2 last:mb-0">
                        <p className="text-sm text-yellow-700">
                          <strong>Row {item.row}:</strong> {item.error}
                        </p>
                        <p className="text-xs text-yellow-600">Product: {item.data.name || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {uploadResults.summary.successful > 0 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">
                ✅ Successfully uploaded {uploadResults.summary.successful} products to the <strong>{categoryPage}</strong> page!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkUpload;
