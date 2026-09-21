import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AppError } from '../utils/AppError.js';

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed!', 400, 'VALIDATION_ERROR'), false);
  }
};

const documentFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/html',
    'text/csv',
    'text/markdown',
    'application/json',
    'application/rtf',
    'text/rtf',
  ];

  const allowedExtensions = ['.pdf', '.txt', '.docx', '.doc', '.html', '.csv', '.md', '.json', '.rtf'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (
    file.mimetype.startsWith('text/') ||
    allowedMimeTypes.includes(file.mimetype) ||
    allowedExtensions.includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Only document files (PDF, TXT, DOCX, etc.) are allowed!',
        400,
        'VALIDATION_ERROR'
      ),
      false
    );
  }
};

export const uploadImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export const uploadDocument = multer({
  storage,
  fileFilter: documentFileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

const audioFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'audio/mp3',
    'audio/mpeg',
    'audio/wav',
    'audio/x-wav',
    'audio/wave',
    'audio/ogg',
    'audio/flac',
    'audio/x-flac',
    'audio/aac',
    'audio/m4a',
    'audio/x-m4a',
    'audio/mp4',
    'audio/webm',
  ];

  const allowedExtensions = ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a', '.mp4', '.webm', '.wma'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (
    file.mimetype.startsWith('audio/') ||
    allowedMimeTypes.includes(file.mimetype) ||
    allowedExtensions.includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Only audio files (MP3, WAV, OGG, FLAC, AAC, M4A, etc.) are allowed!',
        400,
        'VALIDATION_ERROR'
      ),
      false
    );
  }
};

export const uploadAudio = multer({
  storage,
  fileFilter: audioFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

