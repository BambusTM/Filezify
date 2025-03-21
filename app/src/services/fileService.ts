import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const fetchFilesAPI = async (folderPath = '') => {
    const response = await api.get(`/files?folderPath=${encodeURIComponent(folderPath)}`);
    return response.data;
};

export const uploadFileAPI = async (file: File, folderPath = '') => {
    const formData = new FormData();
    formData.append('file', file);
    if (folderPath) {
        formData.append('folderPath', folderPath);
    }
    const response = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};
