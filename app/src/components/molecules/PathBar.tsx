'use client';

interface PathBarProps {
  currentFolder: string;
  onGoBack: () => void;
}

export default function PathBar({ currentFolder, onGoBack }: PathBarProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 my-4 flex items-center space-x-2">
      {currentFolder && (
        <button onClick={onGoBack} className="p-2 rounded-md hover:bg-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" className="w-6 h-6 text-gray-300"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
        </button>
      )}
      <div className="relative flex-grow">
        <input
          type="text"
          value={`filezify:/${currentFolder}`}
          readOnly
          className="w-full pr-3 py-4 pl-2 border border-gray-700 rounded-md bg-transparent text-gray-300 focus:outline-none"
        />
      </div>
    </div>
  );
} 