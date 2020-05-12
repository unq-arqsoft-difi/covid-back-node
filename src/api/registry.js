const express = require('express');
const controller = require('../controller/registry');

const router = express.Router();

// Routes
router.post('/registry', controller.formValidations, controller.registry);

module.exports = router;
