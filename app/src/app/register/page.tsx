'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import AuthCard from '@/components/molecules/AuthCard';
import AuthTitle from '@/components/molecules/AuthTitle';
import AuthFormInput from '@/components/molecules/AuthFormInput';
import Button from '@/components/atoms/Button';
import PageTransition from '@/components/PageTransition';
import { useRegister } from '@/hooks/useRegister';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/app';
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { register, loading, error } = useRegister();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await register(username, email, password);
    router.push(`/login?registered=true&callbackUrl=${encodeURIComponent(callbackUrl)}`);
  };

  const goToLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  };

  return (
    <PageTransition className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <AuthCard>
        <motion.div 
          className="absolute top-4 left-4 hover:text-accent-light"
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.a 
            href="#" 
            onClick={goToLogin}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.a>
        </motion.div>
        <AuthTitle title="Create your account" />
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <AuthFormInput
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              label="Username"
              autoComplete="username"
            />
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
              autoComplete="new-password"
            />
          </div>

          <div>
            <Button disabled={loading} className="w-full btn-primary">
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </div>
        </form>
      </AuthCard>
    </PageTransition>
  );
}