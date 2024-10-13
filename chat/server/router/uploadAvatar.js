import multer from 'multer';
import User from '../models/User.js';

// Configure multer to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Define where the file should be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Define the filename
  }
});

const upload = multer({ storage: storage });

// Handle the avatar upload request
app.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
  const userId = req.session.userid; // Assuming you're using session-based authentication

  try {
    if (!req.file) {
      return res.status(400).send({ error: 'No file uploaded' });
    }

    // Get the user's document and update the avatar field
    const avatarPath = `/uploads/${req.file.filename}`;
    await User.findByIdAndUpdate(userId, { avatar: avatarPath });

    res.send({ message: 'Avatar uploaded successfully', avatar: avatarPath });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).send({ error: 'Failed to upload avatar' });
  }
});
