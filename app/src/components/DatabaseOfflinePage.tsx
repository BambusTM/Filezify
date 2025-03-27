'use client';

import { motion } from 'framer-motion';
import { useDatabaseStatus } from '@/providers/DatabaseStatusProvider';

export default function DatabaseOfflinePage() {
  const { lastChecked, checkNow } = useDatabaseStatus();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Format time for display
  const formatTime = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden text-gray-100 flex items-center justify-center">
      {/* Background decor */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-red-500"></div>
        <div className="absolute bottom-10 left-40 w-32 h-32 rounded-full bg-red-600"></div>
        <div className="absolute top-40 left-20 w-16 h-16 rounded-full bg-red-700"></div>
        <div className="absolute bottom-40 right-20 w-24 h-24 rounded-full bg-red-400"></div>
        <div className="absolute inset-0 backdrop-blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="py-12"
        >
          <motion.div 
            variants={itemVariants} 
            className="text-red-400 mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Database Currently Offline
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-300 mb-8"
          >
            We&apos;re experiencing connection issues with our database. Our team has been notified and is working to resolve the issue as quickly as possible.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="mb-8"
          >
            <div className="text-gray-400 mb-1">
              Last checked: {formatTime(lastChecked)}
            </div>
            <div className="text-gray-400">
              Status: <span className="text-red-400 font-semibold">Offline</span>
            </div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
          >
            <motion.button
              onClick={checkNow}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 border border-gray-700 transition duration-300"
            >
              Retry Connection
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 