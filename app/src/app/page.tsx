'use client';

import Navigation from '@/components/organisms/Navigation';
import PathBar from '@/components/molecules/PathBar';
import ActionBar from '@/components/molecules/ActionBar';
import FileContent from '@/components/organisms/FileContent';
import { useFiles } from '@/hooks/useFiles';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

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
  const fileInputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;
  
  // Initialize view type from localStorage or default to 'grid'
  const [viewType, setViewType] = useState<'grid' | 'details'>('grid');
  
  // Load saved view preference from localStorage on initial render
  useEffect(() => {
    const savedView = localStorage.getItem('viewType');
    if (savedView === 'grid' || savedView === 'details') {
      setViewType(savedView);
    }
  }, []);
  
  // Update localStorage when view type changes
  const handleViewTypeChange = (newViewType: 'grid' | 'details') => {
    setViewType(newViewType);
    localStorage.setItem('viewType', newViewType);
  };

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
      
      <PathBar 
        currentFolder={currentFolder} 
        onGoBack={handleGoBack} 
      />
      
      <ActionBar 
        onCreateFolder={handleCreateFolder}
        onUploadButtonClick={handleUploadButtonClick}
        fileInputRef={fileInputRef}
        uploading={uploading}
        viewType={viewType}
        setViewType={handleViewTypeChange}
        onFileUpload={handleFileUpload}
      />
      
      <FileContent 
        folders={folders}
        files={files}
        onFolderClick={handleFolderClick}
        onDeleteFolder={handleDeleteFolder}
        onDeleteFile={handleDeleteFile}
        viewType={viewType}
        error={error}
      />
    </div>
  );
}
