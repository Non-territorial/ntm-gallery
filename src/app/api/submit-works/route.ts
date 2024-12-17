import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PinataSDK } from 'pinata-web3';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

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
    const pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT,
      pinataGateway: process.env.PINATA_GATEWAY,
    });

    // Parse form data
    const formData = await request.formData();
    const name = formData.get('name')?.toString();
    const email = formData.get('email')?.toString();
    const tonWallet = formData.get('ton-wallet')?.toString();

    if (!name || !email || !tonWallet) {
      return errorResponse('Missing required fields', 400, { name, email, tonWallet });
    }

    // Process file uploads
    const files: File[] = [];
    for (let i = 1; i <= 100; i++) {
      const file = formData.get(`work-${i}`);
      if (file instanceof File) files.push(file);
    }

    if (files.length === 0) return errorResponse('No files uploaded', 400);

    // Upload files to Pinata
    const uploadedFiles = await Promise.all(
      files.map(async (file, index) => {
        const result = await pinata.upload.file(file, {
          metadata: { name: file.name },
        });
        return { originalName: file.name, ipfsHash: result.IpfsHash };
      })
    );

    console.log('Files uploaded to IPFS:', uploadedFiles);

    // Generate and upload metadata JSON
    const metadataUploads = await Promise.all(
      uploadedFiles.map(async (file, index) => {
        const metadata = {
          name: `Artwork ${index + 1}`,
          description: `Uploaded by ${name}`,
          image: `ipfs://${file.ipfsHash}`, // Link to the uploaded file
          attributes: [], // Optional additional attributes
        };

        const metadataResult = await pinata.upload.json(metadata, {
          metadata: { name: `metadata-${file.originalName}` },
        });

        return { originalName: file.originalName, metadataCID: metadataResult.IpfsHash };
      })
    );

    console.log('Metadata JSON uploaded to IPFS:', metadataUploads);

    // Respond with uploaded files and metadata CIDs
    return NextResponse.json({
      success: true,
      message: 'Works submitted successfully',
      files: uploadedFiles,
      metadata: metadataUploads,
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
