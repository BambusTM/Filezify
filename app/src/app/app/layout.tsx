'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useDatabaseStatus } from '@/providers/DatabaseStatusProvider';
import DatabaseOfflinePage from '@/components/DatabaseOfflinePage';

export default function AppLayout({ children }: { children: ReactNode }) {
  const { status } = useDatabaseStatus();
  const [showOfflinePage, setShowOfflinePage] = useState(false);
  
  // Add a delay before showing the offline page to avoid flashing
  // during initial loading or transient network issues
  useEffect(() => {
    if (status === 'offline') {
      // Wait for 2 seconds before showing the offline page
      // This prevents flashing the error page for momentary issues
      const timer = setTimeout(() => {
        setShowOfflinePage(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      setShowOfflinePage(false);
    }
  }, [status]);
  
  // Only show offline page if status has been 'offline' for the delay period
  if (showOfflinePage) {
    return <DatabaseOfflinePage />;
  }
  
  return <>{children}</>;
} 