const express = require('express');
const router = express.Router();
const passport = require('passport');

//importing controller
const accountController = require('../controllers/AccountController');

//importing errorHandler
const {catchErrors} = require('../handlers/errorHandlers');

// Declaring all of our get routes 
router.get('/',accountController.login);
router.get('/register',accountController.register);
router.get('/home',(req,res)=>{
    res.json(req.user);
});

// API logins 
router.get('/auth/facebook',passport.authenticate('facebook',{scope:'email'}));
router.get('/auth/facebook/callback',passport.authenticate('facebook',{
    failureRedirect:'/',
    successRedirect: '/home'
}));

// Declaring all of our post routes
router.post('/login',accountController.signin);
router.post('/register',accountController.validateRegister,catchErrors(accountController.signup),accountController.signin);

module.exports = router;
