import './globals.css';
import { Inter } from 'next/font/google';
import DecorativeBackground from '@/components/atoms/DecorativeBackground';
import Providers from "@/providers/Providers";
import { DatabaseStatusProvider } from '@/providers/DatabaseStatusProvider';
import {ReactNode} from "react";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Filezify - Cloud Storage',
    description: 'Secure cloud storage for your files',
};

export default function RootLayout({children}: {
    children: ReactNode
}) {
    return (
        <html lang="en">
        <body className={`${inter.className} bg-background text-foreground relative`}>
          <DecorativeBackground />
          <Providers>
            <DatabaseStatusProvider>
              {children}
            </DatabaseStatusProvider>
          </Providers>
        </body>
        </html>
    );
}
