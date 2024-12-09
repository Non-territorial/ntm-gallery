import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import pinataSDK from '@pinata/sdk'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300 // Set maximum duration to 5 minutes

export async function POST(request: NextRequest) {
  console.log('Request received:', { headers: Object.fromEntries(request.headers), method: request.method });
  console.log('API route hit - Starting submission process')
  
  // First, verify environment variables are set
  if (!process.env.NEXT_PUBLIC_PINATA_API_KEY || !process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY) {
    console.error('Missing Pinata API keys in environment variables')
    return NextResponse.json(
      { 
        success: false, 
        message: 'Server configuration error - Missing API keys',
      },
      { status: 500 }
    )
  }

  try {
    // Initialize Pinata client with error handling
    console.log('Initializing Pinata client...')
    let pinata
    try {
      pinata = new pinataSDK({
        pinataApiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY,
        pinataSecretApiKey: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY
      })
    } catch (initError) {
      console.error('Failed to initialize Pinata client:', initError)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to initialize Pinata client',
          error: initError instanceof Error ? initError.message : 'Initialization error'
        },
        { status: 500 }
      )
    }

    // Test Pinata authentication with timeout
    console.log('Testing Pinata authentication...')
    try {
      const authTimeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Authentication timeout')), 10000)
      )
      await Promise.race([
        pinata.testAuthentication(),
        authTimeout
      ])
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

    // Parse form data with error handling
    console.log('Parsing form data...')
    let formData
    try {
      formData = await request.formData()
    } catch (formError) {
      console.error('Failed to parse form data:', formError)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to parse form data',
          error: formError instanceof Error ? formError.message : 'Form parsing error'
        },
        { status: 400 }
      )
    }
    
    // Process form data
    const name = formData.get('name')
    const email = formData.get('email')
    const tonWallet = formData.get('ton-wallet')
    
    console.log('Validating form data:', { name: !!name, email: !!email, tonWallet: !!tonWallet })
    
    // Validate required fields
    if (!name || !email || !tonWallet) {
      console.error('Missing required fields')
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields',
          details: {
            name: !name ? 'missing' : 'present',
            email: !email ? 'missing' : 'present',
            tonWallet: !tonWallet ? 'missing' : 'present'
          }
        },
        { status: 400 }
      )
    }

    // Handle file uploads with detailed logging
    console.log('Processing file uploads...')
    const files = []
    for (let i = 1; i <= 100; i++) {
      const file = formData.get(`work-${i}`)
      if (file instanceof File) {
        console.log(`Found file ${i}:`, { name: file.name, type: file.type, size: file.size })
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

    // Upload files to Pinata with improved error handling
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

        // Add metadata with error handling
        try {
          console.log(`Adding metadata for file ${index + 1}...`)
          await pinata.hashMetadata(result.IpfsHash, {
            keyvalues: {
              artist: name.toString(),
              email: email.toString(),
              tonWallet: tonWallet.toString()
            } as any // Type assertion to avoid TS error
          })
          console.log(`Metadata added for file ${index + 1}`)
        } catch (metadataError) {
          console.error(`Failed to add metadata for file ${index + 1}:`, metadataError)
          // Continue with the upload even if metadata fails
        }
        
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
    console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
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


