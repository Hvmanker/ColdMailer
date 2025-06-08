const express = require('express');
const router = express.Router();
const upload = require('../utils/multerconfig');  // Assuming multer config is in this file
const { formController } = require('../controller/formController');  // Import controller

router.post('/submit-form', upload.single('csvFile'), formController);

module.exports = router;
