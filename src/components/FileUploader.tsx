import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { useExcelParser } from '../hooks/useExcelParser';
import type { InvoiceData } from '../types';

interface FileUploaderProps {
  onDataLoaded: (data: InvoiceData[]) => void;
}

export function FileUploader({ onDataLoaded }: FileUploaderProps) {
  const { parseFile } = useExcelParser(onDataLoaded);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) parseFile(file);
  }, [parseFile]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
  });

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        {...getRootProps()}
        className={`px-5 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 flex items-center gap-3 ${
          isDragActive
            ? 'border-primary bg-primary/10'
            : 'border-outline-variant/40 hover:border-primary/60 hover:bg-surface-container-high'
        }`}
      >
        <input {...getInputProps()} />
        {acceptedFiles.length > 0 ? (
          <>
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            <div className="flex flex-col">
              <span className="text-xs font-label text-primary tracking-wide truncate max-w-[120px]">
                {acceptedFiles[0].name}
              </span>
              <span className="text-[9px] font-label text-on-surface-variant uppercase tracking-widest">
                Uploaded
              </span>
            </div>
          </>
        ) : (
          <>
            <Upload className={`w-5 h-5 ${isDragActive ? 'text-primary' : 'text-on-surface-variant'}`} />
            <span className={`text-xs font-label tracking-wide ${isDragActive ? 'text-primary' : 'text-on-surface-variant'}`}>
              {isDragActive ? 'Drop Excel file' : 'Upload Ledger'}
            </span>
          </>
        )}
      </div>
    </motion.div>
  );
}
