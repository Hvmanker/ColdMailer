const express = require('express');
const router = express.Router();
const {generateTemplate} = require('../controller/TemplateController')
router.post('/generate-template',generateTemplate);

module.exports = router;