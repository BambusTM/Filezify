import {useState} from 'react';
import {registerUser} from '@/services/authService';
import {useToast} from "@/providers/ToastProvider";

export function useRegister() {
    const [loading, setLoading] = useState(false);
    const { showError } = useToast();

    const register = async (username: string, email: string, password: string) => {
        setLoading(true);
        try {
            return await registerUser(username, email, password);
        } catch (err: unknown) {
            if (err instanceof Error) {
                showError(err.message);
            } else {
                const errorMessage = 'Registration failed';
                showError(errorMessage);
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { register, loading };
}
