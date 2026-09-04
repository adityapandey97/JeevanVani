import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer disk storage for recorded audio blobs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.webm';
    cb(null, `voice-${uniqueSuffix}${ext}`);
  }
});

export const audioUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/') || file.mimetype === 'video/webm' || file.mimetype === 'application/octet-stream') {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are permitted!'), false);
    }
  }
});

export class VoiceService {
  /**
   * Process voice file or transcript
   */
  static processAudioTranscript(req) {
    const file = req.file;
    const bodyTranscript = req.body.transcript || '';

    return {
      filePath: file ? file.path : null,
      fileName: file ? file.filename : null,
      transcript: bodyTranscript.trim(),
      mimeType: file ? file.mimetype : null,
    };
  }

  /**
   * Returns voice configuration metadata for Web Speech API
   */
  static getVoiceConfig(language = 'hi') {
    if (language === 'hi') {
      return {
        langCode: 'hi-IN',
        preferredVoices: ['Google हिन्दी', 'Microsoft Hemant', 'Microsoft Kalpana', 'hi-IN'],
        rate: 0.95,
        pitch: 1.0,
      };
    }
    return {
      langCode: 'en-IN',
      preferredVoices: ['Google UK English Female', 'Microsoft Ravi', 'Microsoft Heera', 'en-IN'],
      rate: 1.0,
      pitch: 1.0,
    };
  }
}

export default VoiceService;
