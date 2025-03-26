'use client';

import Navigation from '@/components/organisms/Navigation';
import { useFiles } from '@/hooks/useFiles';
import { ChangeEvent, useRef, useState } from 'react';

export default function HomePage() {
  const { 
    files, 
    folders, 
    loading, 
    error, 
    uploadFile, 
    currentFolder, 
    setCurrentFolder, 
    createFolder,
    deleteFile,
    deleteFolder
  } = useFiles();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await uploadFile(file);
    setUploading(false);
  };

  const handleFolderClick = (folderName: string) => {
    const newPath = currentFolder ? `${currentFolder}/${folderName}` : folderName;
    setCurrentFolder(newPath);
  };

  const handleGoBack = () => {
    if (!currentFolder) return;
    const parts = currentFolder.split('/');
    parts.pop();
    setCurrentFolder(parts.join('/'));
  };

  const handleCreateFolder = async () => {
    const folderName = prompt('Enter folder name');
    if (!folderName) return;
    await createFolder(folderName);
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteFile = async (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation(); // Prevent file download
    if (confirm('Are you sure you want to delete this file?')) {
      await deleteFile(fileId);
    }
  };

  const handleDeleteFolder = async (e: React.MouseEvent, folderName: string) => {
    e.stopPropagation(); // Prevent folder navigation
    if (confirm(`Are you sure you want to delete the folder "${folderName}" and all its contents?`)) {
      await deleteFolder(folderName);
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl text-gray-300">Loading...</div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-background">
        <Navigation />

        {/* Large Path Input Field */}
        <div className="max-w-7xl mx-auto px-4 my-4 flex items-center space-x-2">
          {currentFolder && (
              <button onClick={handleGoBack} className="p-2 rounded-md hover:bg-gray-700">
                <svg
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" className="w-6 h-6 text-gray-300"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
              </button>
          )}
          <div className="relative flex-grow">
            <input
                type="text"
                value={`filezify:/${currentFolder}`}
                readOnly
                className="w-full pr-3 py-4 pl-2 border border-gray-700 rounded-md bg-transparent text-gray-300 focus:outline-none"
            />
          </div>
        </div>

        {/* Action Icon Buttons (Create Folder & Upload File) */}
        <div className="max-w-7xl mx-auto px-4 mt-4 flex space-x-4">
          <button
              onClick={handleCreateFolder}
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
              onClick={handleUploadButtonClick}
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
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
          />
        </div>

        {/* Files and Folders Listing */}
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {error && <div className="mb-4 text-center text-red-400">{error}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {folders.map((folder) => (
                  <div
                      key={folder}
                      className="relative group bg-gray-800 rounded-lg p-4 shadow-lg transform transition hover:-translate-y-1 fade-in cursor-pointer"
                      onClick={() => handleFolderClick(folder)}
                  >
                    <div className="flex items-center justify-center h-20">
                      <svg
                          className="w-12 h-12 text-accent"
                          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-accent text-center">{folder}</h3>
                    
                    {/* Delete folder button */}
                    <button
                      onClick={(e) => handleDeleteFolder(e, folder)}
                      className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 bg-opacity-0 hover:bg-opacity-80 rounded-full transition-all duration-200"
                      title="Delete folder"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
              ))}
              {files.length === 0 && folders.length === 0 ? (
                  <p className="text-gray-400 col-span-full text-center">
                    No files or folders uploaded yet
                  </p>
              ) : (
                  files.map((file) => (
                      <div
                          key={file.id}
                          className="relative group bg-gray-800 rounded-lg p-4 shadow-lg transform transition hover:-translate-y-1 fade-in cursor-pointer"
                          onClick={() => (window.location.href = `/api/files/${file.id}/download`)}
                      >
                        <h3 className="text-xl font-semibold text-accent">{file.name}</h3>
                        <p className="text-gray-400 text-sm">
                          {new Date(file.uploadedAt).toLocaleDateString()} • {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <div className="mt-2 flex justify-between items-center">
                          {file.locked && <span className="text-yellow-500">🔒</span>}
                          <span className="text-gray-400 text-sm">{file.downloadCount} downloads</span>
                        </div>
                        
                        {/* Delete file button */}
                        <button
                          onClick={(e) => handleDeleteFile(e, file.id)}
                          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 bg-opacity-0 hover:bg-opacity-80 rounded-full transition-all duration-200"
                          title="Delete file"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
