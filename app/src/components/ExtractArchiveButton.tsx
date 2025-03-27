'use client';

import { useState, useRef } from 'react';
import axios from 'axios';
import { useToast } from '@/providers/ToastProvider';

interface ExtractArchiveButtonProps {
  currentFolder: string;
  onExtracted: () => void;
}

const ExtractArchiveButton: React.FC<ExtractArchiveButtonProps> = ({ 
  currentFolder, 
  onExtracted 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showSuccess, showError } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file is a tar.gz or tgz
    if (!file.name.endsWith('.tar.gz') && !file.name.endsWith('.tgz')) {
      showError('Only .tar.gz or .tgz archives are supported');
      return;
    }

    setIsUploading(true);
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      if (currentFolder) {
        formData.append('folderPath', currentFolder);
      }

      // Send the request
      const response = await axios.post('/api/files/extract', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showSuccess(`Archive extracted to ${response.data.folder}`);
      onExtracted();
      
      // Reset input value so the same file can be uploaded again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error extracting archive:', error);
      showError('Failed to extract archive');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".tar.gz,.tgz"
      />
      <button
        onClick={handleClick}
        disabled={isUploading}
        className="flex items-center space-x-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm font-medium text-gray-200"
        title="Upload and extract .tar.gz archive"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-5 h-5"
        >
          <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
          <path d="M17 8V6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2" />
          <path d="M12 8v8" />
          <path d="M8 12l4-4 4 4" />
        </svg>
        <span>{isUploading ? 'Extracting...' : 'Extract Archive'}</span>
      </button>
    </>
  );
};

export default ExtractArchiveButton; 