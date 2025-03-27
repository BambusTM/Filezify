import {useState} from 'react';
import {registerUser} from '@/services/authService';

export function useRegister() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const register = async (username: string, email: string, password: string) => {
        setLoading(true);
        try {
            return await registerUser(username, email, password);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Registration failed');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { register, loading, error };
}
