// file: src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import Providers from '@/components/Providers';
import DecorativeBackground from "@/components/DecorativeBackground";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Filezify - Cloud Storage',
    description: 'Secure cloud storage for your files',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
        <body className={`${inter.className} bg-background text-foreground relative`}>
        <DecorativeBackground />
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}
