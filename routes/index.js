const express = require('express');
const router = express.Router();
const passport = require('passport');

//importing controller
const accountController = require('../controllers/AccountController');
const companyController = require('../controllers/CompanyController');
const userController = require('../controllers/UserController');

//importing errorHandler
const {catchErrors} = require('../handlers/errorHandlers');

// importing middleware
const middleware = require('../handlers/middleware');

/********************************** 
 Declaring all of our get routes 
***********************************/

//Account Controller 
router.get('/',middleware.unauthGuard,accountController.login);
router.get('/register',middleware.unauthGuard,accountController.register);
router.get('/reset/:id/:token',middleware.unauthGuard,accountController.reset);
router.get('/logout',accountController.logout);

// API logins 
router.get('/auth/facebook',passport.authenticate('facebook',{scope:'email'}));
router.get('/auth/facebook/callback',passport.authenticate('facebook',{
    failureRedirect:'/',
    successRedirect: '/home'
}));
router.get('/auth/google',passport.authenticate('google',{scope:['email']}));
router.get('/auth/google/callback',passport.authenticate('google',{
    failureRedirect:'/',
    successRedirect:'/home'
}));


//Company Controller
router.get('/home',companyController.home);
router.get('/company/add',companyController.addCompany);
router.get('/company/:id',companyController.getCompany);

// User Controller
router.get('/profile',userController.getProfile);

// Declaring all of our post routes
router.post('/login',middleware.validateAuth,accountController.signin);
router.post('/register',middleware.validateRegister,catchErrors(accountController.signup),accountController.signin);

module.exports = router;
