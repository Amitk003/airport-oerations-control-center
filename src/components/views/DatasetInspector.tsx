import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Upload, 
  BookOpen, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';
import { DATA_DICTIONARY } from '../../data/dictionary';
import { exportToCSV, downloadCSV } from '../../utils/csvParser';

export const DatasetInspector: React.FC = () => {
  const { 
    flights, 
    gateEvents, 
    baggage, 
    passengers, 
    security, 
    maintenance, 
    staff, 
    retail,
    importCSVDataset
  } = useOperational();

  const [activeTable, setActiveTable] = useState<string>('flights.csv');
  const [viewMode, setViewMode] = useState<'data' | 'dictionary' | 'raw_csv'>('data');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const getDatasetByName = (name: string) => {
    switch (name) {
      case 'flights.csv': return flights;
      case 'gate_events.csv': return gateEvents;
      case 'baggage.csv': return baggage;
      case 'passengers.csv': return passengers;
      case 'security_screening.csv': return security;
      case 'maintenance_logs.csv': return maintenance;
      case 'staff_shifts.csv': return staff;
      case 'retail_transactions.csv': return retail;
      default: return [];
    }
  };

  const currentData = getDatasetByName(activeTable);
  const rawCSVString = exportToCSV(currentData);
  const currentDict = DATA_DICTIONARY.find((d) => d.tableName === activeTable);

  const handleDownload = () => {
    downloadCSV(rawCSVString, activeTable);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        const success = importCSVDataset(activeTable, content);
        if (success) {
          setUploadStatus(`Successfully parsed and loaded ${activeTable}!`);
          setTimeout(() => setUploadStatus(null), 4000);
        } else {
          setUploadStatus(`Failed to parse CSV format for ${activeTable}.`);
          setTimeout(() => setUploadStatus(null), 4000);
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 font-mono text-xs text-[#1A1A1A]">
      {/* Upload Notification Banner */}
      {uploadStatus && (
        <div className={`p-3 border font-bold flex items-center space-x-2 ${
          uploadStatus.includes('Successfully') ? 'bg-emerald-100 border-[#1A1A1A] text-emerald-950' : 'bg-rose-100 border-[#1A1A1A] text-rose-950'
        }`}>
          {uploadStatus.includes('Successfully') ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{uploadStatus}</span>
        </div>
      )}

      {/* Dataset Selector Bar */}
      <div className="bg-white border border-[#1A1A1A] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center space-x-1 bg-[#F9F8F6] p-1 border border-[#1A1A1A]">
          {[
            'flights.csv',
            'gate_events.csv',
            'baggage.csv',
            'passengers.csv',
            'security_screening.csv',
            'maintenance_logs.csv',
            'staff_shifts.csv',
            'retail_transactions.csv',
          ].map((table) => (
            <button
              key={table}
              onClick={() => setActiveTable(table)}
              className={`px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider transition border ${
                activeTable === table
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-white text-[#555555] border-transparent hover:text-[#1A1A1A] hover:border-[#1A1A1A]'
              }`}
            >
              {table.replace('.csv', '')}
            </button>
          ))}
        </div>

        {/* View Mode & Export Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-[#F9F8F6] p-1 border border-[#1A1A1A]">
            <button
              onClick={() => setViewMode('data')}
              className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition ${
                viewMode === 'data' ? 'bg-[#1A1A1A] text-white' : 'text-[#555555]'
              }`}
            >
              Data Grid
            </button>
            <button
              onClick={() => setViewMode('dictionary')}
              className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition ${
                viewMode === 'dictionary' ? 'bg-[#1A1A1A] text-white' : 'text-[#555555]'
              }`}
            >
              Dictionary
            </button>
            <button
              onClick={() => setViewMode('raw_csv')}
              className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition ${
                viewMode === 'raw_csv' ? 'bg-[#1A1A1A] text-white' : 'text-[#555555]'
              }`}
            >
              Raw CSV
            </button>
          </div>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold flex items-center space-x-1.5 border border-[#1A1A1A] text-xs uppercase tracking-wider"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <label className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#333333] text-white border border-[#1A1A1A] font-bold flex items-center space-x-1.5 cursor-pointer text-xs uppercase tracking-wider">
            <Upload className="w-3.5 h-3.5" />
            <span>Import</span>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'data' && (
        <div className="bg-white border border-[#1A1A1A] overflow-hidden">
          <div className="p-3 bg-[#F9F8F6] border-b border-[#1A1A1A] flex items-center justify-between">
            <div className="font-bold text-[#1A1A1A] text-xs">
              Dataset: <span className="text-[#1A1A1A] font-mono">{activeTable}</span> ({currentData.length} Records)
            </div>
            <div className="text-[10px] text-[#555555]">
              Source: Delhi Airport (DEL) Operations Dataset
            </div>
          </div>

          <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
            <table className="w-full text-left font-mono">
              <thead className="bg-[#1A1A1A] text-white text-[10px] uppercase tracking-wider sticky top-0 border-b border-[#1A1A1A]">
                <tr>
                  {currentData.length > 0 &&
                    Object.keys(currentData[0]).map((key) => (
                      <th key={key} className="p-2.5 whitespace-nowrap">{key}</th>
                    ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]/20 text-[#1A1A1A] text-xs">
                {currentData.slice(0, 100).map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F9F8F6]">
                    {Object.values(row).map((val: any, cIdx) => (
                      <td key={cIdx} className="p-2.5 whitespace-nowrap max-w-[200px] truncate">
                        {typeof val === 'boolean' ? (val ? 'TRUE' : 'FALSE') : String(val ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {currentData.length > 100 && (
            <div className="p-2 bg-[#F9F8F6] border-t border-[#1A1A1A] text-center text-[10px] text-[#555555] font-bold">
              Showing first 100 of {currentData.length} records
            </div>
          )}
        </div>
      )}

      {viewMode === 'dictionary' && currentDict && (
        <div className="bg-white border border-[#1A1A1A] p-5 space-y-4">
          <div className="border-b border-[#1A1A1A] pb-3">
            <h2 className="text-base font-bold text-[#1A1A1A] font-mono flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-[#1A1A1A]" />
              <span>Data Dictionary: {currentDict.tableName}</span>
            </h2>
            <p className="text-[#555555] text-xs mt-1">{currentDict.description}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono">
              <thead className="bg-[#1A1A1A] text-white text-[10px] uppercase tracking-wider border-b border-[#1A1A1A]">
                <tr>
                  <th className="p-3">Field Name</th>
                  <th className="p-3">Data Type</th>
                  <th className="p-3">Required</th>
                  <th className="p-3">Field Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]/20 text-[#1A1A1A]">
                {currentDict.fields.map((field) => (
                  <tr key={field.name} className="hover:bg-[#F9F8F6]">
                    <td className="p-3 font-bold text-[#1A1A1A]">{field.name}</td>
                    <td className="p-3 text-[#333333]">{field.type}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold border border-[#1A1A1A] ${
                        field.required ? 'bg-emerald-100 text-emerald-950' : 'bg-[#F2F1EF] text-[#1A1A1A]'
                      }`}>
                        {field.required ? 'REQUIRED' : 'OPTIONAL'}
                      </span>
                    </td>
                    <td className="p-3 text-[#333333]">{field.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === 'raw_csv' && (
        <div className="bg-white border border-[#1A1A1A] p-4 space-y-2">
          <div className="font-bold text-[#1A1A1A] text-xs uppercase tracking-wider">Raw CSV Text Output</div>
          <textarea
            readOnly
            rows={18}
            value={rawCSVString}
            className="w-full bg-[#F9F8F6] border border-[#1A1A1A] p-3 text-[#1A1A1A] font-mono text-[10px] focus:outline-none"
          />
        </div>
      )}
    </div>
  );
};
