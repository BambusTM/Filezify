import { useToast } from '@/providers/ToastProvider';
import axios from 'axios';

export const useDownloadFile = () => {
  const { showError } = useToast();

  const downloadFile = async (fileId: string) => {
    try {
      // First check if the file exists
      const response = await axios.head(`/api/files/${fileId}/download`);
      
      // If the HEAD request is successful, the file exists, so proceed with download
      if (response.status === 200) {
        window.location.href = `/api/files/${fileId}/download`;
      }
    } catch (error: any) {
      // Handle different error responses
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 404) {
          showError('File not found. It may have been deleted or moved.');
        } else if (status === 403) {
          showError('You do not have permission to download this file.');
        } else if (status === 401) {
          showError('Please log in to download this file.');
        } else {
          showError(`Error downloading file: ${data.message || 'Unknown error'}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        showError('Network error. Please check your connection and try again.');
      } else {
        // Something happened in setting up the request
        showError(`Error: ${error.message || 'Unknown error'}`);
      }
    }
  };

  return { downloadFile };
}; 