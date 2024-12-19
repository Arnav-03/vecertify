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
        const fileHash = hash.digest('hex') 
        
        const truncatedHash = fileHash.slice(0, 31); 

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
