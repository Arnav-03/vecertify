import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        
        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        
        const hash = crypto.createHash('sha256')
        hash.update(buffer)
        const fileHash = hash.digest('hex')  // 64-character hex string
        
        // Ensure the hash is 32 bytes (256 bits)
        const truncatedHash = fileHash.slice(0, 31); // You can directly return 64 characters if desired

        console.log(truncatedHash);
        return NextResponse.json({ hash: truncatedHash })
    } catch (error) {
        console.error('Error generating file hash:', error)
        return NextResponse.json(
            { error: 'Error processing file' },
            { status: 500 }
        )
    }
}
