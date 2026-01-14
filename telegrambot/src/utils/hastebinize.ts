import axios from 'axios';

/**
 * Uploads text to Hastebin and returns the URL
 * @param text - The text to upload
 * @returns The Hastebin URL
 */
async function hastebinize(text: string): Promise<string> {
  try {
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid text provided');
    }

    if (text.length > 1000000) { // 1MB limit
      throw new Error('Text too long for Hastebin (max 1MB)');
    }

    const response = await axios.post('https://hastebin.com/documents', text, {
      headers: {
        'Content-Type': 'text/plain'
      },
      timeout: 10000 // 10 second timeout
    });

    if (!response.data || !response.data.key) {
      throw new Error('Invalid response from Hastebin');
    }

    return `https://hastebin.com/${response.data.key}`;
  } catch (error: any) {
    console.error('Hastebin error:', error.message);
    throw new Error(`Hastebin upload failed: ${error.message}`);
  }
}

export default hastebinize;
export { hastebinize };
