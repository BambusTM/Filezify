'use client';
import React from 'react';

interface AuthTitleProps {
    title: string;
    subtitle?: string;
}

export default function AuthTitle({ title, subtitle }: AuthTitleProps) {
    return (
        <div className="text-center mb-6">
            <h2 className="text-4xl font-semibold text-accent drop-shadow">
                {title}
            </h2>
            {subtitle && <p className="mt-2 text-gray-400">{subtitle}</p>}
        </div>
    );
}
