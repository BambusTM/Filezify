'use client';
import { InputHTMLAttributes } from 'react';

export default function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={`w-full px-4 py-3 bg-gray-800 text-foreground rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent ${className || ''}`}
        />
    );
}
