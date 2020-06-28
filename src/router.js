const express = require('express');
const users = require('./api/users');
const login = require('./api/login');
const support = require('./api/support');

const router = express.Router();

router.post('/login', login.loginFormValidations, login.login);
router.post('/users', users.formValidations, users.registry);
router.get('/support/provinces', support.allProvinces);
router.get('/support/provinces/:id', support.idProvince);
router.get('/support/towns', support.allTowns);
router.get('/test', (req, res) => res.json({ msg: 'ok' }));

module.exports = router;
