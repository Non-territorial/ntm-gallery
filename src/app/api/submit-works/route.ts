import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import pinataSDK from '@pinata/sdk'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  console.log('Starting submission process...')
  try {
    // Initialize Pinata client
    console.log('Initializing Pinata client...')
    const pinata = new pinataSDK({
      pinataApiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY,
      pinataSecretApiKey: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY
    })

    // Test Pinata authentication
    console.log('Testing Pinata authentication...')
    try {
      await pinata.testAuthentication()
      console.log('Pinata authentication successful')
    } catch (authError) {
      console.error('Pinata authentication failed:', authError)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to authenticate with Pinata',
          error: authError instanceof Error ? authError.message : 'Authentication error'
        },
        { status: 401 }
      )
    }

    console.log('Parsing form data...')
    const formData = await request.formData()
    
    // Process form data
    const name = formData.get('name')
    const email = formData.get('email')
    const tonWallet = formData.get('ton-wallet')
    
    console.log('Validating required fields...')
    // Validate required fields
    if (!name || !email || !tonWallet) {
      console.error('Missing required fields')
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields',
        },
        { status: 400 }
      )
    }

    console.log('Processing file uploads...')
    // Handle file uploads
    const files = []
    for (let i = 1; i <= 100; i++) {
      const file = formData.get(`work-${i}`)
      if (file instanceof File) {
        files.push(file)
      }
    }

    if (files.length === 0) {
      console.error('No files uploaded')
      return NextResponse.json(
        { 
          success: false, 
          message: 'No files uploaded',
        },
        { status: 400 }
      )
    }

    console.log(`Found ${files.length} files to upload`)

    // Upload files to Pinata
    console.log('Starting file uploads to Pinata...')
    const uploadPromises = files.map(async (file: File, index: number) => {
      try {
        console.log(`Processing file ${index + 1}: ${file.name}`)
        const fileData = await file.arrayBuffer()
        const buffer = Buffer.from(fileData)
        
        console.log(`Uploading file ${index + 1} to Pinata...`)
        const result = await pinata.pinFileToIPFS(buffer, {
          pinataMetadata: {
            name: file.name,
          },
          pinataOptions: {
            cidVersion: 1
          }
        })
        
        console.log(`File ${index + 1} uploaded successfully. IPFS Hash: ${result.IpfsHash}`)

        console.log(`Adding metadata for file ${index + 1}...`)
        await pinata.hashMetadata(result.IpfsHash, {
          keyvalues: {
            artist: name.toString(),
            email: email.toString(),
            tonWallet: tonWallet.toString()
          } as any
        });
        console.log(`Metadata added for file ${index + 1}`)
        
        return {
          originalName: file.name,
          ipfsHash: result.IpfsHash
        }
      } catch (uploadError) {
        console.error(`Error uploading file ${file.name}:`, uploadError)
        throw uploadError
      }
    })

    console.log('Waiting for all file uploads to complete...')
    const uploadedFiles = await Promise.all(uploadPromises)
    console.log('All files uploaded successfully')

    console.log('Submission process completed successfully')
    return NextResponse.json({
      success: true,
      message: 'Works submitted successfully',
      files: uploadedFiles,
      name,
      email,
      tonWallet
    })
  } catch (error) {
    console.error('Error processing submission:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error processing submission',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

