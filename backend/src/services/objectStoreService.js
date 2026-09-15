import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base directory for local object storage
const DEFAULT_STORAGE_DIR = path.resolve(__dirname, '../../uploads/object_store');

export class ObjectStoreService {
  constructor() {
    this.driver = process.env.OBJECT_STORE_DRIVER || 'local'; // 'local' or 's3'
    this.storageDir = process.env.OBJECT_STORE_LOCAL_DIR || DEFAULT_STORAGE_DIR;
    this.s3Bucket = process.env.S3_BUCKET || 'jeevanvani-artifacts';
    this.publicBaseUrl = process.env.OBJECT_STORE_BASE_URL || '/uploads/object_store';

    this.init();
  }

  init() {
    if (this.driver === 'local') {
      const folders = ['audio', 'resumes', 'certificates', 'exports'];
      for (const folder of folders) {
        const dir = path.join(this.storageDir, folder);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      }
    }
  }

  /**
   * Save an audio recording (from voice assessment or speech interaction)
   */
  async saveAudio(fileBuffer, originalName = 'recording.webm', metadata = {}) {
    const timestamp = Date.now();
    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `voice_${timestamp}_${safeName}`;
    const key = `audio/${filename}`;

    if (this.driver === 'local') {
      const targetPath = path.join(this.storageDir, 'audio', filename);
      await fs.promises.writeFile(targetPath, fileBuffer);

      return {
        key,
        filename,
        path: targetPath,
        url: `${this.publicBaseUrl}/${key}`,
        sizeBytes: fileBuffer.length,
        driver: 'local',
        metadata: {
          ...metadata,
          savedAt: new Date().toISOString()
        }
      };
    }

    // S3 Cloud driver stub (can be extended with @aws-sdk/client-s3 if configured)
    return {
      key,
      filename,
      url: `https://${this.s3Bucket}.s3.amazonaws.com/${key}`,
      sizeBytes: fileBuffer.length,
      driver: 's3',
      metadata
    };
  }

  /**
   * Save general file buffer (resumes, documents, knowledge exports)
   */
  async saveFile(fileBuffer, originalName, folder = 'documents', metadata = {}) {
    const timestamp = Date.now();
    const safeName = (originalName || 'file.bin').replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${timestamp}_${safeName}`;
    const key = `${folder}/${filename}`;

    if (this.driver === 'local') {
      const targetDir = path.join(this.storageDir, folder);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const targetPath = path.join(targetDir, filename);
      await fs.promises.writeFile(targetPath, fileBuffer);

      return {
        key,
        filename,
        path: targetPath,
        url: `${this.publicBaseUrl}/${key}`,
        sizeBytes: fileBuffer.length,
        driver: 'local',
        metadata
      };
    }

    return {
      key,
      filename,
      url: `https://${this.s3Bucket}.s3.amazonaws.com/${key}`,
      sizeBytes: fileBuffer.length,
      driver: 's3',
      metadata
    };
  }

  /**
   * Get file as buffer
   */
  async getFile(key) {
    if (this.driver === 'local') {
      const fullPath = path.join(this.storageDir, key);
      if (!fs.existsSync(fullPath)) {
        throw new Error(`Object not found: ${key}`);
      }
      return await fs.promises.readFile(fullPath);
    }
    throw new Error('Cloud S3 getFile requires AWS credentials configuration.');
  }

  /**
   * Check if file exists
   */
  async fileExists(key) {
    if (this.driver === 'local') {
      const fullPath = path.join(this.storageDir, key);
      return fs.existsSync(fullPath);
    }
    return false;
  }

  /**
   * Delete file
   */
  async deleteFile(key) {
    if (this.driver === 'local') {
      const fullPath = path.join(this.storageDir, key);
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
        return true;
      }
      return false;
    }
    return false;
  }

  /**
   * Status and driver health check
   */
  getHealth() {
    return {
      status: 'active',
      driver: this.driver,
      storageDirectory: this.driver === 'local' ? this.storageDir : null,
      bucket: this.driver === 's3' ? this.s3Bucket : null
    };
  }
}

export const objectStore = new ObjectStoreService();
export default objectStore;
