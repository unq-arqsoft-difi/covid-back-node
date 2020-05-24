const express = require('express');
const controller = require('../controller/users');

const router = express.Router();

// Routes
router.post('/', controller.formValidations, controller.registry);

module.exports = router;
