import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const fetchFilesAPI = async (folderPath = '') => {
    const response = await api.get(`/files?folderPath=${encodeURIComponent(folderPath)}`);
    return response.data;
};

export const uploadFileAPI = async (file: File, folderPath = '') => {
    // Create FormData object for file upload
    const formData = new FormData();
    formData.append('file', file);
    
    // Normalize and add folder path if it exists
    if (folderPath) {
        // Make sure paths use forward slashes
        const normalizedPath = folderPath.replace(/\\/g, '/');
        formData.append('folderPath', normalizedPath);
        console.log(`Uploading to folder: ${normalizedPath}`);
    }
    
    // Send the upload request
    const response = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    return response.data;
};
