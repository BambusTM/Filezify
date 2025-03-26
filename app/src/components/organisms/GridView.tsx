'use client';

import { FileData } from '@/hooks/useFiles';

interface GridViewProps {
  folders: string[];
  files: FileData[];
  onFolderClick: (folderName: string) => void;
  onDeleteFolder: (e: React.MouseEvent, folderName: string) => void;
  onDeleteFile: (e: React.MouseEvent, fileId: string) => void;
}

export default function GridView({
  folders,
  files,
  onFolderClick,
  onDeleteFolder,
  onDeleteFile
}: GridViewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {folders.map((folder) => (
        <div
          key={folder}
          className="relative group bg-gray-800 rounded-lg p-4 shadow-lg transform transition hover:-translate-y-1 fade-in cursor-pointer"
          onClick={() => onFolderClick(folder)}
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
            onClick={(e) => onDeleteFolder(e, folder)}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 bg-opacity-0 hover:bg-opacity-80 rounded-full transition-all duration-200"
            title="Delete folder"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      ))}
      
      {files.map((file) => (
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
            onClick={(e) => onDeleteFile(e, file.id)}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 bg-opacity-0 hover:bg-opacity-80 rounded-full transition-all duration-200"
            title="Delete file"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      ))}
      
      {files.length === 0 && folders.length === 0 && (
        <p className="text-gray-400 col-span-full text-center">
          No files or folders uploaded yet
        </p>
      )}
    </div>
  );
} 