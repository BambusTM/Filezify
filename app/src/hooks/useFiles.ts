import { useState, useEffect, useCallback } from 'react';
import { fetchFilesAPI, uploadFileAPI } from '@/services/fileService';
import axios from 'axios';
import { useToast } from '@/providers/ToastProvider';

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
    const { showError } = useToast();

    const fetchFiles = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchFilesAPI(currentFolder);
            setFiles(data.files as FileData[]);
            setFolders(data.folders as string[]);
        } catch (err: unknown) {
            let errorMessage: string;
            if (err instanceof Error) {
                errorMessage = err.message;
            } else {
                errorMessage = 'Error fetching files';
            }
            setError(errorMessage);
            showError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [currentFolder, showError]);

    const uploadFile = useCallback(async (file: File) => {
        setLoading(true);
        try {
            await uploadFileAPI(file, currentFolder);
            await fetchFiles();
        } catch (err: unknown) {
            let errorMessage: string;
            if (err instanceof Error) {
                errorMessage = err.message;
            } else {
                errorMessage = 'Error uploading file';
            }
            setError(errorMessage);
            showError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [currentFolder, fetchFiles, showError]);

    const createFolder = useCallback(async (folderName: string) => {
        setLoading(true);
        try {
            await axios.post('/api/folders', { folderName, parentPath: currentFolder });
            await fetchFiles();
        } catch (err: unknown) {
            let errorMessage: string;
            if (err instanceof Error) {
                errorMessage = err.message;
            } else {
                errorMessage = 'Error creating folder';
            }
            setError(errorMessage);
            showError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [currentFolder, fetchFiles, showError]);

    const deleteFile = useCallback(async (fileId: string) => {
        setLoading(true);
        try {
            await axios.delete(`/api/files/${fileId}`);
            await fetchFiles();
        } catch (err: unknown) {
            let errorMessage: string;
            if (err instanceof Error) {
                errorMessage = err.message;
            } else {
                errorMessage = 'Error deleting file';
            }
            setError(errorMessage);
            showError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [fetchFiles, showError]);

    const deleteFolder = useCallback(async (folderName: string) => {
        setLoading(true);
        try {
            await axios.delete(`/api/folders?path=${encodeURIComponent(currentFolder)}&name=${encodeURIComponent(folderName)}`);
            await fetchFiles();
        } catch (err: unknown) {
            let errorMessage: string;
            if (err instanceof Error) {
                errorMessage = err.message;
            } else {
                errorMessage = 'Error deleting folder';
            }
            setError(errorMessage);
            showError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [currentFolder, fetchFiles, showError]);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    return { 
        files, 
        folders, 
        loading, 
        error, 
        uploadFile, 
        fetchFiles, 
        currentFolder, 
        setCurrentFolder, 
        createFolder,
        deleteFile,
        deleteFolder 
    };
}
