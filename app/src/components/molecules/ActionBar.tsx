'use client';

import { RefObject } from 'react';

interface ActionBarProps {
  onCreateFolder: () => void;
  onUploadButtonClick: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
  uploading: boolean;
  viewType: 'grid' | 'details';
  setViewType: (viewType: 'grid' | 'details') => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ActionBar({
  onCreateFolder,
  onUploadButtonClick,
  fileInputRef,
  uploading,
  viewType,
  setViewType,
  onFileUpload
}: ActionBarProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 mt-4 flex justify-between">
      <div className="flex space-x-4">
        <button
          onClick={onCreateFolder}
          className="w-12 h-12 flex items-center justify-center bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" className="w-6 h-6 text-gray-300"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11v6m-3-3h6" />
          </svg>
        </button>
        <button
          onClick={onUploadButtonClick}
          className="w-12 h-12 flex items-center justify-center bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" className="w-6 h-6 text-gray-300"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 12l-4-4-4 4m4-4v8" />
          </svg>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileUpload}
          className="hidden"
          disabled={uploading}
        />
      </div>
      
      {/* View Toggle Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => setViewType('grid')}
          className={`w-12 h-12 flex items-center justify-center rounded-md focus:outline-none transition-colors ${
            viewType === 'grid' 
              ? 'bg-accent text-gray-900' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
          title="Grid view"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
        </button>
        <button
          onClick={() => setViewType('details')}
          className={`w-12 h-12 flex items-center justify-center rounded-md focus:outline-none transition-colors ${
            viewType === 'details' 
              ? 'bg-accent text-gray-900' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
          title="Details view"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
          </svg>
        </button>
      </div>
    </div>
  );
} 