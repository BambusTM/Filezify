import { Metadata } from 'next';
import ChangePasswordForm from '@/components/ChangePasswordForm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Profile Settings - Filezify',
  description: 'Manage your Filezify account settings',
};

export default async function ProfileSettings() {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6 text-foreground">Account Settings</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-gray-900 p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-3 text-foreground">Settings</h2>
              <nav className="space-y-1">
                <a 
                  href="#password" 
                  className="block px-3 py-2 rounded-md bg-accent-dark text-foreground font-medium hover:bg-accent"
                >
                  Password
                </a>
                {/* Add more setting links here as needed */}
              </nav>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-lg shadow-md mt-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                  {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || '?'}
                </div>
                <div>
                  <div className="font-medium text-foreground">{session.user?.name || session.user?.email}</div>
                  <div className="text-sm text-gray-400">{session.user?.email}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <section id="password" className="mb-8">
              <ChangePasswordForm />
            </section>
            
            {/* Add more settings sections here as needed */}
          </div>
        </div>
      </div>
    </div>
  );
} 