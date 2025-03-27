'use client';

import Navigation from '@/components/organisms/Navigation';
import { useFiles } from '@/hooks/useFiles';
import Button from '@/components/atoms/Button';
import {ChangeEvent} from "react";

export default function HomePage() {
  const { files, loading, error, uploadFile } = useFiles();

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl text-gray-300">Loading...</div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8 text-center">
              <h1 className="text-4xl font-extrabold text-accent mb-2">Your Files</h1>
              <p className="text-gray-400">Manage and view your uploaded files</p>
            </header>

            <div className="mb-8 flex justify-center">
              <label className="relative cursor-pointer overflow-hidden">
                <input
                    type="file"
                    onChange={handleFileUpload}
                    disabled={loading}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Button className="btn-primary">Upload File</Button>
              </label>
              {loading && <p className="ml-4 text-gray-400">Uploading...</p>}
            </div>

            {error && <div className="mb-4 text-center text-red-400">{error}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {files.length === 0 ? (
                  <p className="text-gray-400 col-span-full text-center">No files uploaded yet</p>
              ) : (
                  files.map((file: any) => (
                      <div
                          key={file.id}
                          className="relative group bg-gray-800 rounded-lg p-4 shadow-lg transform transition hover:-translate-y-1 fade-in cursor-pointer"
                          onClick={() => (window.location.href = `/api/files/${file.id}/download`)}
                      >
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <svg
                              className="w-12 h-12 text-white group-hover:animate-pop"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                          >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-accent">{file.name}</h3>
                        <p className="text-gray-400 text-sm">
                          {new Date(file.uploadedAt).toLocaleDateString()} • {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <div className="mt-2 flex justify-between items-center">
                          {file.locked && <span className="text-yellow-500">🔒</span>}
                          <span className="text-gray-400 text-sm">{file.downloadCount} downloads</span>
                        </div>
                      </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
