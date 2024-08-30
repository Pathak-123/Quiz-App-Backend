const express = require('express');
const { newUser, Login, updatePassword } = require('../controller/User');
const  authFunction  = require('../middleware/auth');

const router = express.Router(); 

router.post('/signup', newUser);
router.post('/login', Login); 
router.put('/update', authFunction, updatePassword);

module.exports = router;