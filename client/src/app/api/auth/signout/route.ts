import { NextRequest, NextResponse } from 'next/server';
import { createSessionClient } from '@/lib/appwrite';

export async function POST(_req: NextRequest) {  // Prefixed 'req' with _
  try {
    const { account } = await createSessionClient();
    await account.deleteSession('current');
    return NextResponse.json({ message: 'Signed out successfully' }, { status: 200 });
  } catch (_error) {  // Prefixed 'error' with _
    return NextResponse.json({ message: 'Error signing out' }, { status: 500 });
  }
}

export const runtime = "edge";
