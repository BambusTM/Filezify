'use client';

import { FormEvent, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AuthCard from '@/components/molecules/AuthCard';
import AuthFormInput from '@/components/molecules/AuthFormInput';
import AuthTitle from '@/components/molecules/AuthTitle';
import Button from '@/components/atoms/Button';
import PageTransition from '@/components/PageTransition';
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await login(email, password, callbackUrl);
  };

  const goToRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    const currentCallbackUrl = callbackUrl || '/app';
    router.push(`/register?callbackUrl=${encodeURIComponent(currentCallbackUrl)}`);
  };

  return (
    <PageTransition className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <AuthCard>
        <AuthTitle title="Sign in to your account" />
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-5">
            <AuthFormInput
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email address"
              autoComplete="email"
            />
            <AuthFormInput
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              autoComplete="current-password"
            />
          </div>

          <div>
            <Button disabled={loading} className="w-full btn-primary">
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>

        <div className="text-center mt-6">
          <motion.a 
            href="#" 
            onClick={goToRegister}
            className="text-accent hover:text-accent-light font-medium inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Don&apos;t have an account? Sign up
          </motion.a>
        </div>
      </AuthCard>
    </PageTransition>
  );
}