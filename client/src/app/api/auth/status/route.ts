import { NextResponse } from 'next/server';
import { getLoggedInUser } from '@/lib/appwrite';

export async function GET() {
  try {
    const user = await getLoggedInUser();
    if (user) {
      return NextResponse.json({ isLoggedIn: true });
    } else {
      return NextResponse.json({ isLoggedIn: false });
    }
  } catch (error) {
    console.error('Error checking authentication:', error);
    return NextResponse.json({ isLoggedIn: false });
  }
}