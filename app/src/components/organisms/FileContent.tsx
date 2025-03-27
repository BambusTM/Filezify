'use client';

import { FileData } from '@/hooks/useFiles';
import GridView from './GridView';
import DetailsView from './DetailsView';

interface FileContentProps {
  folders: string[];
  files: FileData[];
  onFolderClick: (folderName: string) => void;
  onDeleteFolder: (e: React.MouseEvent, folderName: string) => void;
  onDeleteFile: (e: React.MouseEvent, fileId: string) => void;
  viewType: 'grid' | 'details';
  error: string | null;
}

export default function FileContent({
  folders,
  files,
  onFolderClick,
  onDeleteFolder,
  onDeleteFile,
  viewType,
  error
}: FileContentProps) {
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {viewType === 'grid' ? (
          <GridView 
            folders={folders} 
            files={files} 
            onFolderClick={onFolderClick}
            onDeleteFolder={onDeleteFolder}
            onDeleteFile={onDeleteFile}
          />
        ) : (
          <DetailsView 
            folders={folders} 
            files={files} 
            onFolderClick={onFolderClick}
            onDeleteFolder={onDeleteFolder}
            onDeleteFile={onDeleteFile}
          />
        )}
      </div>
    </div>
  );
} 