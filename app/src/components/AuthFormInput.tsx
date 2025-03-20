'use client';
import React from 'react';

interface AuthFormInputProps {
    id: string;
    name: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    autoComplete?: string;
}

export default function AuthFormInput({
                                          id,
                                          name,
                                          type,
                                          placeholder,
                                          value,
                                          onChange,
                                          label,
                                          autoComplete,
                                      }: AuthFormInputProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-gray-300">
                {label}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                autoComplete={autoComplete}
                required
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-3 bg-gray-800 text-foreground rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
            />
        </div>
    );
}
