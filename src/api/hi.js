const express = require('express');

const router = express.Router();

const hi = async (req, res) => {
  res.jsonOK({result: 'Its work!' });
};

// Routes
router.get('/', hi);

module.exports = router;
