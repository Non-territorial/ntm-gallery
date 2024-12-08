import axios from 'axios';

export async function uploadToPinata(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  const pinataSecretApiKey = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;

  if (!pinataApiKey || !pinataSecretApiKey) {
    throw new Error('Pinata API keys are not set. Please check your environment variables.');
  }

  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${(formData as any)._boundary}`,
          'pinata_api_key': pinataApiKey,
          'pinata_secret_api_key': pinataSecretApiKey
        }
      }
    );

    return res.data.IpfsHash;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Pinata API error:', error.response?.data);
    }
    throw error;
  }
}

