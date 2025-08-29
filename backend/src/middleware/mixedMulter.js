// src/middleware/multerConfig.js
import multer from 'multer';
import path from 'path';
import fs from 'fs'; // Import fs for file system operations
import { fileURLToPath } from 'url'; // For ES Modules __dirname

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRootDir = path.resolve(__dirname, '../../');
const UPLOAD_IMAGE_DIR = path.join(projectRootDir, 'uploads', 'images');
const UPLOAD_RESOURCE_DIR = path.join(projectRootDir, 'uploads', 'files');
fs.existsSync(UPLOAD_IMAGE_DIR) || fs.mkdirSync(UPLOAD_IMAGE_DIR, { recursive: true });
fs.existsSync(UPLOAD_RESOURCE_DIR) || fs.mkdirSync(UPLOAD_RESOURCE_DIR, { recursive: true });
const combinedStorage = multer.memoryStorage();

const combinedFileFilter = (req, file, cb) => {
  const imageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
  const docTypes = [
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
    'application/vnd.ms-excel', 
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
    'text/plain',
    'application/zip',
  ];

  if (file.fieldname === 'imagen' && imageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else if (file.fieldname === 'recurso' && docTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type for field '${file.fieldname}': ${file.mimetype}. Allowed types for imagen are ${imageTypes.join(', ')}. Allowed types for recurso are ${docTypes.join(', ')}.`), false);
  }
};

const uploadMultiple = multer({
  storage: combinedStorage,
  fileFilter: combinedFileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024 
  }
}).fields([
  { name: 'imagen', maxCount: 10 }, 
  { name: 'recurso', maxCount: 5 } 
]);

export default uploadMultiple;
export const saveFileToDisk = async (fileBuffer, originalname, fieldname) => {
    const ext = path.extname(originalname);
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${fieldname}${ext}`;
    let uploadDir;

    if (fieldname === 'imagen') {
        uploadDir = UPLOAD_IMAGE_DIR;
    } else if (fieldname === 'recurso') {
        uploadDir = UPLOAD_RESOURCE_DIR;
    } else {
        throw new Error('Unknown field name provided for file saving.');
    }

    const filePath = path.join(uploadDir, filename);
    await fs.promises.writeFile(filePath, fileBuffer);
    return path.relative(projectRootDir, filePath).replace(/\\/g, '/');
};