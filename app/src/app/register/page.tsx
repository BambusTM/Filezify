'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthCard from '@/components/molecules/AuthCard';
import AuthTitle from '@/components/molecules/AuthTitle';
import AuthFormInput from '@/components/molecules/AuthFormInput';
import Button from '@/components/atoms/Button';
import { useRegister } from '@/hooks/useRegister';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { register, loading, error } = useRegister();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      await register(username, email, password);
      router.push('/login?registered=true');
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <AuthCard>
          <Link href="/login" className="absolute top-4 left-4 hover:text-accent-light">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
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

            {error && <div className="text-red-400 text-sm text-center">{error}</div>}

            <div>
              <Button disabled={loading} className="w-full btn-primary">
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </div>
          </form>
        </AuthCard>
      </div>
  );
}