const express = require('express');
const controller = require('../controller/auth');

const router = express.Router();

// Routes
router.post('/login', controller.loginFormValidations, controller.login);

module.exports = router;
