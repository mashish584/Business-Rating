const express = require('express');
const router = express.Router();

//importing controller
const accountController = require('../controllers/AccountController');

//importing errorHandler
const {catchErrors} = require('../handlers/errorHandlers');

// Declaring all of our get routes 
router.get('/',accountController.login);
router.get('/register',accountController.register);

// Declaring all of our post routes
router.post('/register',accountController.validateRegister,catchErrors(accountController.signup),accountController.signin);

module.exports = router;
