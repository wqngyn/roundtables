const express = require('express');
const router = express.Router();
const querystring = require("querystring"); 

const auth_controller = require('../middleware/controllers/authController');

router.get('/authorization', auth_controller.authorization_get);

module.exports = router;
