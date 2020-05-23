const express = require('express');
const controller = require('../controller/auth');

const router = express.Router();

// Routes
router.post('/', controller.loginFormValidations, controller.login);

module.exports = router;
