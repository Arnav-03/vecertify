import { useState, useEffect } from 'react';
import { AppwriteUser } from '@/lib/types';
import { getLoggedInUser, getMetamaskAddress, verifyMetamaskAddress } from '@/lib/appwrite';
import { useRouter, usePathname } from 'next/navigation';

export const useUser = () => {
  const [user, setUser] = useState<AppwriteUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [metaMask, setMetaMask] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  // Define routes that do not require login
  const publicRoutes = ['/', '/about','/contact', '/login', '/register','/signup','/details'];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = (await getLoggedInUser()) as AppwriteUser;
        
        // If user is logged in
        if (userData) {
          // Fetch Metamask address
          const metaMask = await getMetamaskAddress();
          if (metaMask.success) {
            setMetaMask(metaMask.metamaskAddress);
          }

          setUser(userData);
        } 
        
        // Check if the user is logged in
        if (!userData && !publicRoutes.includes(pathname)) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [pathname]); // Re-run the effect when pathname changes

  return { user, loading, metaMask,setUser };
};