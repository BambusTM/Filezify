import { useState, useEffect } from 'react';
import { fetchFilesAPI, uploadFileAPI } from '@/services/fileService';

export function useFiles() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const data = await fetchFilesAPI();
            setFiles(data.files);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Error fetching files');
            }
        } finally {
            setLoading(false);
        }
    };

    const uploadFile = async (file: File) => {
        setLoading(true);
        try {
            await uploadFileAPI(file);
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
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    return { files, loading, error, uploadFile, fetchFiles };
}
