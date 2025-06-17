const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define upload directories
const imageDir = path.join(__dirname, '..', 'Uploads', 'images');
const videoDir = path.join(__dirname, '..', 'Uploads', 'videos');
const profilePicDir = path.join(__dirname, '..', 'Uploads', 'profilepics');

// Ensure all directories exist
[imageDir, videoDir, profilePicDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'course_image') {
      cb(null, imageDir);
    } else if (file.fieldname === 'videos') {
      cb(null, videoDir);
    } else if (file.fieldname === 'profile_pic') {
      cb(null, profilePicDir);
    } else {
      cb(new Error('Invalid fieldname'), null);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, ext);
    const uniqueName = `${baseName.replace(/\s+/g, '_')}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB max per file
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'course_image' && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else if (file.fieldname === 'videos' && file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else if (file.fieldname === 'profile_pic' && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

module.exports = upload;
