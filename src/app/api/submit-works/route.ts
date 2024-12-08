import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    const name = formData.get('name')
    const email = formData.get('email')
    const tonWallet = formData.get('ton-wallet')

    const files = []
    for (let i = 1; i <= 100; i++) {
      const file = formData.get(`work-${i}`)
      if (file) {
        files.push(file)
      }
    }

    // Create a dummy socket (This part is likely unnecessary with formData)
    // const socket = new Socket({ readable: true, writable: true })

    // Create an IncomingMessage instance (This part is likely unnecessary with formData)
    // const msg = new IncomingMessage(socket)

    // Copy headers (This part is likely unnecessary with formData)
    // for (const [key, value] of req.headers.entries()) {
    //   msg.headers[key] = value
    // }

    // Copy other properties (This part is likely unnecessary with formData)
    // msg.method = req.method
    // msg.url = req.url

    // Get the request body (This part is handled by formData)
    // const chunks: Buffer[] = []
    // const reader = req.body?.getReader()
    // if (reader) {
    //   try {
    //     while (true) {
    //       const { done, value } = await reader.read()
    //       if (done) break
    //       chunks.push(Buffer.from(value))
    //     }
    //   } finally {
    //     reader.releaseLock()
    //   }
    // }

    // Push the body to the message (This part is handled by formData)
    // const body = Buffer.concat(chunks)
    // msg.push(body)
    // msg.push(null)

    // const form = new IncomingForm()

    // return new Promise((resolve, reject) => {
    //   form.parse(msg, async (err: Error | null, fields: Fields, files: Files) => {

    // Initialize Pinata client
    const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT })

    // Upload each file to Pinata
    const uploadPromises = files.map(async (file: any) => {
      const fileData = await file.arrayBuffer()
      const buffer = Buffer.from(fileData)
      const result = await pinata.pinFileToIPFS(buffer, {
        pinataMetadata: {
          name: file.name,
        },
      })
      return {
        originalName: file.name,
        ipfsHash: result.IpfsHash
      }
    })

    const uploadedFiles = await Promise.all(uploadPromises)

    return NextResponse.json({
      success: true,
      message: 'Works submitted successfully',
      files: uploadedFiles,
      name: name,
      email: email,
      tonWallet: tonWallet
    })
  } catch (error) {
    console.error('Error processing submission:', error)
    return NextResponse.json(
      { success: false, message: 'Error processing submission', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

