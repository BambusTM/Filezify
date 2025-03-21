'use client';

import Navigation from '@/components/organisms/Navigation';
import { useFiles, FileData } from '@/hooks/useFiles';
import Button from '@/components/atoms/Button';
import { ChangeEvent, useState } from 'react';

export default function HomePage() {
  const { files, folders, loading, error, uploadFile, currentFolder, setCurrentFolder, createFolder } = useFiles();
  const [uploading, setUploading] = useState(false);

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
        <div className="py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8 text-center">
              <h1 className="text-4xl font-extrabold text-accent mb-2">Your Files</h1>
              <p className="text-gray-400">Manage and view your uploaded files</p>
            </header>

            {/* Breadcrumb Navigation */}
            <div className="mb-4 flex items-center">
              {currentFolder && (
                  <Button onClick={handleGoBack} className="mr-2 btn-secondary">
                    Go Back
                  </Button>
              )}
              <span className="text-gray-300">
              Current Folder: {currentFolder || 'Root'}
            </span>
            </div>

            {/* Folder Actions */}
            <div className="mb-8 flex justify-center space-x-4">
              <Button onClick={handleCreateFolder} className="btn-primary">
                Create Folder
              </Button>
              <label className="relative cursor-pointer overflow-hidden">
                <input
                    type="file"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Button className="btn-primary">
                  {uploading ? 'Uploading...' : 'Upload File'}
                </Button>
              </label>
            </div>

            {error && <div className="mb-4 text-center text-red-400">{error}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* List folders */}
              {folders.map((folder) => (
                  <div
                      key={folder}
                      className="relative group bg-gray-800 rounded-lg p-4 shadow-lg transform transition hover:-translate-y-1 fade-in cursor-pointer"
                      onClick={() => handleFolderClick(folder)}
                  >
                    <div className="flex items-center justify-center h-20">
                      <svg
                          className="w-12 h-12 text-accent"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-accent text-center">{folder}</h3>
                  </div>
              ))}

              {/* List files */}
              {files.length === 0 && folders.length === 0 ? (
                  <p className="text-gray-400 col-span-full text-center">No files or folders uploaded yet</p>
              ) : (
                  files.map((file: FileData) => (
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
                      </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
