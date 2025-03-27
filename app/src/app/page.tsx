'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

export default function HomePage() {
  const { status } = useSession();
  const router = useRouter();
  
  // Redirect to /app if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/app');
    }
  }, [status, router]);
  
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

  const handleGetStarted = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/login?callbackUrl=/app');
  };

  const handleSignUp = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/register?callbackUrl=/app');
  };

  return (
    <PageTransition className="w-full">
      <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden text-gray-100">
        {/* Background decor */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-indigo-500"></div>
          <div className="absolute bottom-10 left-40 w-32 h-32 rounded-full bg-indigo-600"></div>
          <div className="absolute top-40 left-20 w-16 h-16 rounded-full bg-indigo-700"></div>
          <div className="absolute bottom-40 right-20 w-24 h-24 rounded-full bg-indigo-400"></div>
          <div className="absolute inset-0 backdrop-blur-3xl"></div>
        </div>

        {/* Hero Section */}
        <section className="relative z-10 px-4 pt-24 pb-16 md:pt-32 md:pb-24">
          <div className="max-w-7xl mx-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center"
            >
              <div className="lg:col-span-3">
                <motion.h1 
                  variants={itemVariants}
                  className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-tight"
                >
                  Manage Your Files
                  <span className="block text-indigo-400">With Ease</span>
                </motion.h1>
                
                <motion.p 
                  variants={itemVariants}
                  className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl"
                >
                  Store, organize, and access your files from anywhere with powerful sharing options 
                  and enterprise-grade security.
                </motion.p>
                
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-wrap gap-4"
                >
                  <motion.button
                    onClick={handleGetStarted}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 text-lg font-medium"
                  >
                    Get Started
                  </motion.button>
                  <motion.button
                    onClick={handleSignUp}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 text-indigo-400 bg-gray-800 border border-indigo-500 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300 text-lg font-medium"
                  >
                    Sign Up Free
                  </motion.button>
                </motion.div>
              </div>
              
              <motion.div 
                variants={itemVariants}
                className="lg:col-span-2 relative"
              >
                <div className="w-full h-56 md:h-80 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 to-gray-900/30"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-indigo-400 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative z-10 px-4 py-16 bg-gray-900/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mb-16"
            >
              <motion.h2 
                variants={itemVariants}
                className="text-3xl md:text-4xl font-bold text-indigo-400 mb-4"
              >
                Why Choose Filezify
              </motion.h2>
              <motion.div 
                variants={itemVariants}
                className="w-24 h-1 bg-indigo-600 mb-6"
              />
            </motion.div>

            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
            >
              <motion.div
                variants={itemVariants}
                className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700"
              >
                <div className="text-indigo-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-200">Secure Storage</h3>
                <p className="text-gray-400">
                  Your files are encrypted and stored securely, ensuring your data stays private.
                </p>
              </motion.div>
              
              <motion.div
                variants={itemVariants}
                className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700"
              >
                <div className="text-indigo-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-200">Easy Sharing</h3>
                <p className="text-gray-400">
                  Share files and folders with others with just a few clicks.
                </p>
              </motion.div>
              
              <motion.div
                variants={itemVariants}
                className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700"
              >
                <div className="text-indigo-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                    <line x1="12" y1="18" x2="12" y2="18"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-200">Access Anywhere</h3>
                <p className="text-gray-400">
                  Access your files from any device, anytime, anywhere.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="relative z-10 px-4 py-16 bg-indigo-900/40">
          <div className="max-w-7xl mx-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="md:flex items-center justify-between bg-gray-800 p-8 md:p-12 rounded-xl border border-gray-700 shadow-xl"
            >
              <div className="md:max-w-xl mb-8 md:mb-0">
                <motion.h2 
                  variants={itemVariants}
                  className="text-3xl font-bold mb-4 text-indigo-300"
                >
                  Ready to Get Started?
                </motion.h2>
                <motion.p 
                  variants={itemVariants}
                  className="text-gray-300 mb-0"
                >
                  Join thousands of satisfied users who trust Filezify for their file management needs.
                </motion.p>
              </div>
              <motion.div 
                variants={itemVariants}
              >
                <motion.button
                  onClick={handleSignUp}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-indigo-600 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-500 transition duration-300 w-full md:w-auto"
                >
                  Create Free Account
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="relative z-10 px-4 py-8 mt-8 border-t border-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-gray-400 text-center">
              © {new Date().getFullYear()} Filezify. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}
