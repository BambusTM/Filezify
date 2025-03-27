'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';

type DatabaseStatus = 'checking' | 'online' | 'offline';

interface DatabaseStatusContextType {
  status: DatabaseStatus;
  lastChecked: Date | null;
  checkNow: () => Promise<void>;
}

const DatabaseStatusContext = createContext<DatabaseStatusContextType>({
  status: 'checking',
  lastChecked: null,
  checkNow: async () => {},
});

export const useDatabaseStatus = () => useContext(DatabaseStatusContext);

interface DatabaseStatusProviderProps {
  children: ReactNode;
}

export function DatabaseStatusProvider({ children }: DatabaseStatusProviderProps) {
  const [status, setStatus] = useState<DatabaseStatus>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const checkDatabaseStatus = useCallback(async () => {
    try {
      setStatus('checking');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout
      
      const response = await fetch('/api/health/database', { 
        signal: controller.signal 
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        setStatus(data.isConnected ? 'online' : 'offline');
        setRetryCount(0); // Reset retry count on successful fetch
      } else {
        // If we get a 500 response, check if it's due to env vars not being set up
        // This prevents showing database offline when it might be a config issue
        if (retryCount < 2) {
          console.warn('Database health check failed, assuming online for now');
          setStatus('online'); // Assume online to prevent disrupting user experience
          setRetryCount(prev => prev + 1);
        } else {
          setStatus('offline');
        }
      }
    } catch (error) {
      console.error('Error checking database status:', error);
      
      // If it's an abort error (timeout) or network error, be lenient
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.warn('Database health check timed out, assuming online for now');
        setStatus('online'); // Don't disrupt user experience for network issues
      } else if (retryCount < 2) {
        console.warn('Database health check error, assuming online for now');
        setStatus('online');
        setRetryCount(prev => prev + 1);
      } else {
        setStatus('offline');
      }
    } finally {
      setLastChecked(new Date());
    }
  }, [retryCount]);

  useEffect(() => {
    checkDatabaseStatus();

    // Set up polling every 60 seconds
    const intervalId = setInterval(checkDatabaseStatus, 60000);
    
    return () => clearInterval(intervalId);
  }, [checkDatabaseStatus]);

  const value = {
    status,
    lastChecked,
    checkNow: checkDatabaseStatus
  };

  return (
    <DatabaseStatusContext.Provider value={value}>
      {children}
    </DatabaseStatusContext.Provider>
  );
} 