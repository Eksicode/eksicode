import { PrismaClient, Media, MediaType } from '@prisma/client';
import { HttpException } from '../exceptions/HttpException';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export interface MediaUpload {
  originalName: string;
  buffer: Buffer;
  mimeType: string;
  size: number;
  altText?: string;
}

class MediaService {
  private prisma: PrismaClient;
  private uploadDir: string;
  private maxFileSize: number;
  private allowedMimeTypes: string[];

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.uploadDir = process.env.UPLOAD_DIR || 'uploads';
    this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '5242880'); // 5MB default
    this.allowedMimeTypes = [
      'image/jpeg',
      'image/png', 
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'video/mp4',
      'video/webm',
      'audio/mpeg',
      'audio/wav',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
  }

  /**
   * Validate uploaded file
   */
  private validateFile(file: MediaUpload): void {
    if (file.size > this.maxFileSize) {
      throw new HttpException(400, `File size exceeds maximum allowed size of ${this.maxFileSize / 1024 / 1024}MB`);
    }

    if (!this.allowedMimeTypes.includes(file.mimeType)) {
      throw new HttpException(400, `File type ${file.mimeType} is not allowed`);
    }
  }

  /**
   * Determine media type from MIME type
   */
  private getMediaType(mimeType: string): MediaType {
    if (mimeType.startsWith('image/')) return MediaType.IMAGE;
    if (mimeType.startsWith('video/')) return MediaType.VIDEO;
    if (mimeType.startsWith('audio/')) return MediaType.AUDIO;
    return MediaType.DOCUMENT;
  }

  /**
   * Generate unique filename
   */
  private generateFilename(originalName: string): string {
    const ext = path.extname(originalName);
    const uuid = uuidv4();
    return `${uuid}${ext}`;
  }

  /**
   * Ensure upload directory exists
   */
  private async ensureUploadDir(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Upload file and create media record
   */
  public async uploadMedia(file: MediaUpload): Promise<Media> {
    try {
      // Validate file
      this.validateFile(file);

      // Ensure upload directory exists
      await this.ensureUploadDir();

      // Generate unique filename
      const filename = this.generateFilename(file.originalName);
      const filePath = path.join(this.uploadDir, filename);

      // Write file to disk
      await fs.writeFile(filePath, file.buffer);

      // Create media record in database
      const media = await this.prisma.media.create({
        data: {
          originalName: file.originalName,
          filename: filename,
          url: `/uploads/${filename}`, // Relative URL path
          mimeType: file.mimeType,
          size: file.size,
          altText: file.altText,
          type: this.getMediaType(file.mimeType)
        }
      });

      return media;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Failed to upload media', { originalError: error });
    }
  }

  /**
   * Get media by ID
   */
  public async getMediaById(id: number): Promise<Media | null> {
    try {
      return await this.prisma.media.findUnique({
        where: { id }
      });
    } catch (error) {
      throw new HttpException(500, 'Failed to get media', { originalError: error });
    }
  }

  /**
   * Get all media with pagination
   */
  public async getAllMedia(
    skip: number = 0,
    limit: number = 20,
    type?: MediaType
  ): Promise<{ media: Media[]; count: number }> {
    try {
      const where = type ? { type } : {};

      const [media, count] = await Promise.all([
        this.prisma.media.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        this.prisma.media.count({ where })
      ]);

      return { media, count };
    } catch (error) {
      throw new HttpException(500, 'Failed to get media list', { originalError: error });
    }
  }

  /**
   * Update media metadata
   */
  public async updateMedia(id: number, data: { altText?: string }): Promise<Media> {
    try {
      const existingMedia = await this.getMediaById(id);
      if (!existingMedia) {
        throw new HttpException(404, 'Media not found');
      }

      return await this.prisma.media.update({
        where: { id },
        data
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Failed to update media', { originalError: error });
    }
  }

  /**
   * Delete media and associated file
   */
  public async deleteMedia(id: number): Promise<void> {
    try {
      const media = await this.getMediaById(id);
      if (!media) {
        throw new HttpException(404, 'Media not found');
      }

      // Check if media is being used by any entities
      const usage = await this.checkMediaUsage(id);
      if (usage.isUsed) {
        throw new HttpException(400, `Media is currently in use: ${usage.usedBy.join(', ')}`);
      }

      // Delete file from disk
      const filePath = path.join(this.uploadDir, media.filename);
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.warn(`Failed to delete file ${filePath}:`, error);
        // Continue with database deletion even if file deletion fails
      }

      // Delete database record
      await this.prisma.media.delete({
        where: { id }
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Failed to delete media', { originalError: error });
    }
  }

  /**
   * Check if media is being used by any entities
   */
  private async checkMediaUsage(mediaId: number): Promise<{ isUsed: boolean; usedBy: string[] }> {
    try {
      const usedBy: string[] = [];

      // Check users (profile pictures)
      const userCount = await this.prisma.user.count({
        where: { profilePictureId: mediaId }
      });
      if (userCount > 0) usedBy.push(`${userCount} user(s)`);

      // Check posts (header images)
      const postCount = await this.prisma.post.count({
        where: { headerImageId: mediaId }
      });
      if (postCount > 0) usedBy.push(`${postCount} post(s)`);

      // Check pages (header images)
      const pageCount = await this.prisma.page.count({
        where: { headerImgId: mediaId }
      });
      if (pageCount > 0) usedBy.push(`${pageCount} page(s)`);

      // Check companies (logos)
      const companyCount = await this.prisma.company.count({
        where: { logoId: mediaId }
      });
      if (companyCount > 0) usedBy.push(`${companyCount} company(s)`);

      return {
        isUsed: usedBy.length > 0,
        usedBy
      };
    } catch (error) {
      console.error('Error checking media usage:', error);
      return { isUsed: false, usedBy: [] };
    }
  }

  /**
   * Clean up unused media files
   */
  public async cleanupUnusedMedia(): Promise<{ deletedCount: number; errors: string[] }> {
    try {
      const allMedia = await this.prisma.media.findMany();
      let deletedCount = 0;
      const errors: string[] = [];

      for (const media of allMedia) {
        try {
          const usage = await this.checkMediaUsage(media.id);
          if (!usage.isUsed) {
            await this.deleteMedia(media.id);
            deletedCount++;
          }
        } catch (error) {
          errors.push(`Failed to delete media ${media.id}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }

      return { deletedCount, errors };
    } catch (error) {
      throw new HttpException(500, 'Failed to cleanup unused media', { originalError: error });
    }
  }
}

export default MediaService; 