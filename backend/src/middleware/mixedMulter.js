import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '../../');

const combinedStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'imagen') {
      cb(null, path.join(rootDir, 'uploads/images'));
    } else if (file.fieldname === 'recurso') {
      cb(null, path.join(rootDir, 'uploads/files'));
    } else {
      cb(new Error('Unknown field name'), null);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

const combinedFileFilter = (req, file, cb) => {
  const imageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const docTypes = [
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  if (file.fieldname === 'imagen' && imageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else if (file.fieldname === 'recurso' && docTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type for field ${file.fieldname}`), false);
  }
};

const uploadMultiple = multer({
  storage: combinedStorage,
  fileFilter: combinedFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
}).fields([
  { name: 'imagen', maxCount: 1 },
  { name: 'recurso', maxCount: 1 }
]);

export default uploadMultiple;
