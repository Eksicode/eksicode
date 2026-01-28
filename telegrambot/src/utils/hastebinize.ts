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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch('https://hastebin.com/documents', {
      method: 'POST',
      body: text,
      headers: {
        'Content-Type': 'text/plain'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Hastebin returned status ${response.status}`);
    }

    const data = await response.json() as { key?: string };

    if (!data || !data.key) {
      throw new Error('Invalid response from Hastebin');
    }

    return `https://hastebin.com/${data.key}`;
  } catch (error: any) {
    console.error('Hastebin error:', error.message);
    throw new Error(`Hastebin upload failed: ${error.message}`);
  }
}

export default hastebinize;
export { hastebinize };
