// uploadImage.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const imagesDirectory = path.join(process.cwd(), 'uploads/images');
if (!fs.existsSync(imagesDirectory)) {
  fs.mkdirSync(imagesDirectory, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/send-image', upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
  
    // Correct the path to be served properly by the client
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/images/${req.file.filename}`;
    res.status(200).json({ message: 'Image uploaded successfully', imageUrl });
  });
  
export default router;
