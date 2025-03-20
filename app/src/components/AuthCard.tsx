'use client';
import React from 'react';

interface AuthCardProps {
    children: React.ReactNode;
}

export default function AuthCard({ children }: AuthCardProps) {
    return (
        <div className="max-w-md w-full bg-gray-900 p-10 rounded-lg shadow-xl relative">
            {children}
        </div>
    );
}
