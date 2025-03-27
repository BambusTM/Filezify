import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const fetchFilesAPI = async () => {
    const response = await api.get('/files');
    return response.data;
};

export const uploadFileAPI = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};
