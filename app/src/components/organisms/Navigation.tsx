'use client';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Navigation() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
      <nav className="bg-gray-900 bg-opacity-80 shadow-lg backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Link href="/app" className="text-2xl font-bold text-accent">
                Filezify
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">{session.user.name}</span>
              <button onClick={() => signOut()} className="btn btn-secondary">
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>
  );
}