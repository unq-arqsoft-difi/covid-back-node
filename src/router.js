const express = require('express');
const users = require('./api/users');
const login = require('./api/login');
const { allTowns } = require('./api/towns');
const { allProvinces } = require('./api/provinces');

const router = express.Router();

router.post('/login', login.loginFormValidations, login.login);
router.post('/users', users.formValidations, users.registry);
router.get('/provinces', allProvinces);
router.get('/towns', allTowns);

module.exports = router;
