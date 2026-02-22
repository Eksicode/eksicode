import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Using AWS SDK v3
const getS3Client = () => {
    return new S3Client({
        region: process.env.AWS_S3_REGION || 'eu-central-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY || '',
            secretAccessKey: process.env.AWS_SECRET_KEY || ''
        }
    });
};

export const uploadToS3 = async (
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string
): Promise<{ url: string, filename: string }> => {
    const bucketName = process.env.AWS_S3_BUCKET || 'eksicode-media';
    const ext = path.extname(originalName);
    const uuid = uuidv4();
    const filename = `${uuid}${ext}`;

    const s3Client = getS3Client();

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: filename,
        Body: fileBuffer,
        ContentType: mimeType,
    });

    await s3Client.send(command);

    const region = process.env.AWS_S3_REGION || 'eu-central-1';
    const url = `https://${bucketName}.s3.${region}.amazonaws.com/${filename}`;

    return { url, filename };
};

export const deleteFromS3 = async (filename: string): Promise<void> => {
    const bucketName = process.env.AWS_S3_BUCKET || 'eksicode-media';
    const s3Client = getS3Client();

    const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: filename,
    });

    try {
        await s3Client.send(command);
    } catch (error) {
        console.error(`Failed to delete file from S3: ${filename}`, error);
    }
};
