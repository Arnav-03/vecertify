import { useState, useEffect } from 'react'
import { AppwriteUser } from '@/lib/types'
import { getLoggedInUser } from '@/lib/appwrite'
import { useRouter } from 'next/navigation'

export const useUser = () => {
  const [user, setUser] = useState<AppwriteUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router=useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getLoggedInUser() as AppwriteUser
        if (!userData) {
          router.push('/login');
        }
        setUser(userData)
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])
  return { user, loading }
}