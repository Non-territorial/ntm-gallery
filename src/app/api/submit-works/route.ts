import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PinataSDK } from 'pinata-web3';
import "dotenv/config";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 5 minutes max duration for Vercel Hobby Plan

// Helper function for error responses
function errorResponse(message: string, status = 500, details?: any) {
  return NextResponse.json({ success: false, message, details }, { status });
}

export async function POST(request: NextRequest) {
  console.log('API route hit - Starting submission process');

  // Verify Pinata environment variables
  if (!process.env.PINATA_JWT || !process.env.PINATA_GATEWAY) {
    console.error('Missing Pinata API keys or gateway in environment variables');
    return errorResponse('Server configuration error - Missing API keys', 500);
  }

  try {
    // Initialize Pinata client
    console.log('Initializing Pinata client...');
    const pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT,
      pinataGateway: process.env.PINATA_GATEWAY,
    });

    // Parse form data
    console.log('Parsing form data...');
    const formData = await request.formData();

    const name = formData.get('name')?.toString();
    const email = formData.get('email')?.toString();
    const tonWallet = formData.get('ton-wallet')?.toString();

    // Validate required fields
    if (!name || !email || !tonWallet) {
      console.error('Missing required fields:', { name, email, tonWallet });
      return errorResponse('Missing required fields', 400, { name, email, tonWallet });
    }

    // Process file uploads
    console.log('Processing file uploads...');
    const files: File[] = [];
    for (let i = 1; i <= 100; i++) {
      const file = formData.get(`work-${i}`);
      if (file instanceof File) {
        console.log(`Found file ${i}: ${file.name}`);
        files.push(file);
      }
    }

    if (files.length === 0) {
      console.error('No files uploaded');
      return errorResponse('No files uploaded', 400);
    }

    console.log(`Found ${files.length} files to upload`);

    // Upload files to Pinata and create metadata
    const uploadPromises = files.map(async (file, index) => {
      try {
        console.log(`Uploading file ${index + 1}: ${file.name}`);
        const fileUploadResult = await pinata.upload.file(file, {
          metadata: {
            name: file.name, // Add metadata to the file
          },
        });

        // Create metadata JSON object for each file
        const metadata = {
          name: file.name,
          description: `Uploaded by ${name}`,
          image: `ipfs://${fileUploadResult.IpfsHash}`, // Link the file CID in the metadata
        };

        // Upload metadata JSON to Pinata
        console.log(`Uploading metadata for ${file.name}`);
        const metadataUploadResult = await pinata.upload.json(metadata, {
          metadata: { name: `metadata-${file.name}` },
        });

        console.log(`File ${index + 1} uploaded successfully: ${file.name}`);
        console.log(`File CID: ${fileUploadResult.IpfsHash}`);
        console.log(`Metadata CID: ${metadataUploadResult.IpfsHash}`);

        return {
          originalName: file.name,
          fileCID: fileUploadResult.IpfsHash,
          metadataCID: metadataUploadResult.IpfsHash,
        };
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        throw error;
      }
    });

    const uploadedFiles = await Promise.all(uploadPromises);
    console.log('All files and metadata uploaded successfully');

    // Respond with success and return both file and metadata CIDs
    return NextResponse.json({
      success: true,
      message: 'Works submitted successfully',
      files: uploadedFiles,
      name,
      email,
      tonWallet,
    });
  } catch (error) {
    console.error('Error processing submission:', error);
    return errorResponse('Error processing submission', 500, {
      error: error instanceof Error ? error.message : error,
    });
  }
}
