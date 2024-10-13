import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import User from '../models/User.js';  // Import the User model to update the user's avatar field

const router = express.Router();

// Ensure the directory exists
const avatarsDirectory = path.join(process.cwd(), 'uploads/avatars');
if (!fs.existsSync(avatarsDirectory)) {
  fs.mkdirSync(avatarsDirectory, { recursive: true });
}

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarsDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Handle file extension
  }
});

// Filter only images (JPEG, PNG)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed.'), false);
  }
};

// Multer setup
const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB size limit
  fileFilter: fileFilter
});

// Avatar upload route
router.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
  
    try {
      const { userid } = req.body;
      const avatarPath = `/uploads/avatars/${req.file.filename}`; 
  
      const user = await User.findOneAndUpdate(
        { userid: userid },  
        { avatar: avatarPath },  
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ message: 'Avatar uploaded successfully', avatar: avatarPath });
    } catch (error) {
      console.error('Error updating user avatar:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
export default router;
