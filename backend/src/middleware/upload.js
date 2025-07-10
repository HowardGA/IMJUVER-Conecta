// backend/middleware/upload.js
import multer from 'multer';
// import path from 'path';

// const __dirname = path.resolve();
// const storagePath = path.join(__dirname, 'uploads');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, storagePath);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });
const storage = multer.memoryStorage(); 
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG/PNG/JPG files are allowed'), false);
  }
};

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter
});

export default upload;