const multer = require('multer');

// Store the uploaded file in memory
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.endsWith('.csv')) {
      return cb(new Error('Only CSV files are allowed!'), false);
    }
    cb(null, true);
  },
});

module.exports = upload;