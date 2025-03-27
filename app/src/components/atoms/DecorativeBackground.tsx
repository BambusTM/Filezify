'use client';

export default function DecorativeBackground() {
    return (
        <div className="fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-light to-accent-dark opacity-20 animate-pulse"></div>
        </div>
    );
}
