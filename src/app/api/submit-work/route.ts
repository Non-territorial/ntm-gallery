import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  const formData = await request.formData()
  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string
  const tonWallet = formData.get('tonWallet') as string
  const files = formData.getAll('files') as File[]

  if (files.length === 0 || files.length > 1000) {
    return NextResponse.json(
      { success: false, message: 'Please submit between 1 and 1000 files.' },
      { status: 400 }
    )
  }

  try {
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    const fileUrls = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const fileName = `${uuidv4()}-${file.name}`
        const filePath = join(uploadDir, fileName)
        await writeFile(filePath, buffer)
        return `/uploads/${fileName}`
      })
    )

    // TODO: Save the artwork submission to your database
    console.log('Artwork submitted:', {
      fullName,
      email,
      tonWallet,
      fileUrls,
    })

    return NextResponse.json({ success: true, message: 'Artwork submitted successfully' })
  } catch (error) {
    console.error('Error submitting artwork:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to submit artwork. Please try again.' },
      { status: 500 }
    )
  }
}

