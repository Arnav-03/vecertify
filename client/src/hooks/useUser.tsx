import { useState, useEffect } from 'react';
import { AppwriteUser } from '@/lib/types';
import { getLoggedInUser } from '@/lib/appwrite';
import { useRouter, usePathname } from 'next/navigation';

export const useUser = () => {
  const [user, setUser] = useState<AppwriteUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Define routes that do not require login
  const publicRoutes = ['/', '/about','/contact', '/login', '/register','/signup','/details'];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = (await getLoggedInUser()) as AppwriteUser;
        
        // Check if the user is logged in
        if (!userData && !publicRoutes.includes(pathname)) {
          router.push('/login'); // Redirect to login if user is not logged in and not on allowed routes
        } else {
          setUser(userData); // Set user data if logged in
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [pathname]); // Re-run the effect when pathname changes

  return { user, loading };
};
