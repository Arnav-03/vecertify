import { NextRequest, NextResponse } from 'next/server';
import { createSessionClient } from '@/lib/appwrite';

export async function POST(req: NextRequest) {
  try {
    console.log(`Request method: ${req.method}, Request URL: ${req.url}`);
    const { account } = await createSessionClient();
    await account.deleteSession('current');
    return NextResponse.json({ message: 'Signed out successfully' }, { status: 200 });
  } catch(error)  {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export const runtime = "edge"