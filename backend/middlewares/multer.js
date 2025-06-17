// Middleware for file upload using Multer (accept PDFs, Word, and images)
const multer = require('multer');

// Define allowed file types (Images, PDFs, and Word documents)
const allowedFileTypes = /(\.jpg|\.jpeg|\.png|\.gif|\.pdf|\.docx|\.doc)$/i;

const fileFilter = (req, file, cb) => {
    if (allowedFileTypes.test(file.originalname)) {
        cb(null, true);
    } else {
        return cb(new Error('Only image, PDF, or Word files are allowed'));
    }
};

// Configure Multer to store files in memory instead of disk
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB size limit (adjust as necessary)
});


module.exports = upload;
