import { NextResponse } from 'next/server'
import { IncomingForm, Fields, Files } from 'formidable'
import fs from 'fs'
import pinataSDK from '@pinata/sdk'
import { IncomingMessage } from 'http'
import { Socket } from 'net'

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(req: Request) {
  // Create a dummy socket
  const socket = new Socket({ readable: true, writable: true })
  
  // Create an IncomingMessage instance
  const msg = new IncomingMessage(socket)
  
  // Copy headers
  for (const [key, value] of req.headers.entries()) {
    msg.headers[key] = value
  }
  
  // Copy other properties
  msg.method = req.method
  msg.url = req.url
  
  // Get the request body
  const chunks: Buffer[] = []
  const reader = req.body?.getReader()
  if (reader) {
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(Buffer.from(value))
      }
    } finally {
      reader.releaseLock()
    }
  }
  
  // Push the body to the message
  const body = Buffer.concat(chunks)
  msg.push(body)
  msg.push(null)

  const form = new IncomingForm()

  return new Promise((resolve, reject) => {
    form.parse(msg, async (err: Error | null, fields: Fields, files: Files) => {
      if (err) {
        return resolve(NextResponse.json({ 
          success: false,
          message: 'Error parsing form data',
          error: err.message 
        }, { status: 400 }))
      }

      try {
        // Initialize Pinata client
        const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT })

        // Upload each file to Pinata
        const uploadPromises = Object.values(files).map(async (file: any) => {
          const readableStream = fs.createReadStream(file.filepath)
          const result = await pinata.pinFileToIPFS(readableStream, {
            pinataMetadata: {
              name: file.originalFilename,
            },
          })
          return {
            originalName: file.originalFilename,
            ipfsHash: result.IpfsHash
          }
        })

        const uploadedFiles = await Promise.all(uploadPromises)

        // Clean up temporary files
        Object.values(files).forEach((file: any) => {
          fs.unlink(file.filepath, (err) => {
            if (err) console.error('Error deleting temporary file:', err)
          })
        })

        return resolve(NextResponse.json({ 
          success: true,
          message: 'Works submitted successfully',
          files: uploadedFiles
        }))
      } catch (error) {
        // Clean up temporary files on error
        Object.values(files).forEach((file: any) => {
          fs.unlink(file.filepath, (err) => {
            if (err) console.error('Error deleting temporary file:', err)
          })
        })

        return resolve(NextResponse.json({ 
          success: false,
          message: 'Error uploading files',
          error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 }))
      }
    })
  })
}

