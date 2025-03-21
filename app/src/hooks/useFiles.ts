import { useState, useEffect, useCallback } from 'react';
import { fetchFilesAPI, uploadFileAPI } from '@/services/fileService';
import axios from 'axios';

export interface FileData {
    id: string;
    name: string;
    size: number;
    type: string;
    uploadedAt: string; // ISO string from API
    downloadCount: number;
    locked: boolean;
}

export function useFiles() {
    const [files, setFiles] = useState<FileData[]>([]);
    const [folders, setFolders] = useState<string[]>([]);
    const [currentFolder, setCurrentFolder] = useState<string>(''); // current folder path, empty for root
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFiles = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchFilesAPI(currentFolder);
            setFiles(data.files as FileData[]);
            setFolders(data.folders as string[]);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Error fetching files');
            }
        } finally {
            setLoading(false);
        }
    }, [currentFolder]);

    const uploadFile = useCallback(async (file: File) => {
        setLoading(true);
        try {
            await uploadFileAPI(file, currentFolder);
            await fetchFiles();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Error uploading file');
            }
        } finally {
            setLoading(false);
        }
    }, [currentFolder, fetchFiles]);

    const createFolder = useCallback(async (folderName: string) => {
        setLoading(true);
        try {
            await axios.post('/api/folders', { folderName, parentPath: currentFolder });
            await fetchFiles();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Error creating folder');
            }
        } finally {
            setLoading(false);
        }
    }, [currentFolder, fetchFiles]);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    return { files, folders, loading, error, uploadFile, fetchFiles, currentFolder, setCurrentFolder, createFolder };
}
