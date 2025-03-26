'use client';

import { FileData } from '@/hooks/useFiles';

interface DetailsViewProps {
  folders: string[];
  files: FileData[];
  onFolderClick: (folderName: string) => void;
  onDeleteFolder: (e: React.MouseEvent, folderName: string) => void;
  onDeleteFile: (e: React.MouseEvent, fileId: string) => void;
}

export default function DetailsView({
  folders,
  files,
  onFolderClick,
  onDeleteFolder,
  onDeleteFile
}: DetailsViewProps) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {folders.length === 0 && files.length === 0 ? (
        <p className="text-gray-400 p-6 text-center">No files or folders uploaded yet</p>
      ) : (
        <>
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 bg-gray-900 text-gray-300 font-medium">
            <div className="col-span-5">Name</div>
            <div className="col-span-2">Size</div>
            <div className="col-span-3">Date</div>
            <div className="col-span-1">Downloads</div>
            <div className="col-span-1"></div>
          </div>
          
          {/* Folders */}
          {folders.map((folder) => (
            <div 
              key={folder}
              className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer"
              onClick={() => onFolderClick(folder)}
            >
              <div className="col-span-5 flex items-center">
                <svg className="w-5 h-5 mr-2 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                </svg>
                <span className="text-accent">{folder}</span>
              </div>
              <div className="col-span-2">Folder</div>
              <div className="col-span-3">-</div>
              <div className="col-span-1">-</div>
              <div className="col-span-1 flex justify-end">
                <button
                  onClick={(e) => onDeleteFolder(e, folder)}
                  className="w-8 h-8 flex items-center justify-center bg-red-500 bg-opacity-0 hover:bg-opacity-80 rounded-full transition-all duration-200"
                  title="Delete folder"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          
          {/* Files */}
          {files.map((file) => (
            <div 
              key={file.id}
              className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer"
              onClick={() => (window.location.href = `/api/files/${file.id}/download`)}
            >
              <div className="col-span-5 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-accent">{file.name}</span>
                {file.locked && <span className="ml-2 text-yellow-500">🔒</span>}
              </div>
              <div className="col-span-2">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
              <div className="col-span-3">{new Date(file.uploadedAt).toLocaleDateString()}</div>
              <div className="col-span-1">{file.downloadCount}</div>
              <div className="col-span-1 flex justify-end">
                <button
                  onClick={(e) => onDeleteFile(e, file.id)}
                  className="w-8 h-8 flex items-center justify-center bg-red-500 bg-opacity-0 hover:bg-opacity-80 rounded-full transition-all duration-200"
                  title="Delete file"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
} 