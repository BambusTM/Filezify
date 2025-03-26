import {useState} from 'react';
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useToast} from "@/providers/ToastProvider";

export function useAuth() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { showError } = useToast();

    const login = async (email: string, password: string, callbackUrl: string) => {
        setLoading(true);
        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
                callbackUrl,
            });

            if (result?.error) {
                console.error('Login error:', result.error);
                setError(result.error);
                showError(result.error);
            } else {
                router.push(callbackUrl);
            }
        } catch (err) {
            console.error('Login exception:', err);
            const errorMessage = 'An error occurred during login';
            setError(errorMessage);
            showError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
}
