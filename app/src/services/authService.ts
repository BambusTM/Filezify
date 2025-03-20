import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const registerUser = async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
};