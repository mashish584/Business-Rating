const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const jimp = require('jimp');

//importing controller
const accountController = require('../controllers/AccountController');
const companyController = require('../controllers/CompanyController');
const userController = require('../controllers/UserController');

//importing errorHandler
const {catchErrors} = require('../handlers/errorHandlers');

// importing middleware
const middleware = require('../handlers/middleware');

/**********************************
      File Uploading & Resizing 
 **********************************/
const config = {storage : multer.memoryStorage()};

const resize = async(req,res,next) => {
    if(!req.file){
        res.json({error:'Please upload an image'});
        return;
    }
    //check file type
    const image = req.file.mimetype.startsWith('image/');
    if(!image){
        res.json({error:'Invalid file type.'});
    }
    //getting extension
    const ext = req.file.mimetype.split('/')[1];
    //saving name in photo property with new name
    req.body.photo = req.file.originalname.split('.')[0]+"-"+Date.now()+"."+ext;
    let upload = await jimp.read(req.file.buffer);
                 await upload.resize(700,jimp.AUTO);
                 await upload.write('./public/img/uploads/'+req.body.photo);
    
    //call next
    next();
};


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

// AJAX Handles via axios
router.get('/getCities',function(req,res){
    const states = require('../data/states');
    const value = req.query.state;
    const cities = states[value];
    res.json({cities});
});

// Declaring all of our post routes
router.post('/login',middleware.validateAuth,accountController.signin);
router.post('/register',middleware.validateRegister,catchErrors(accountController.signup),accountController.signin);
router.post('/company/add',multer(config).single('photo'),middleware.validateCompany,catchErrors(resize),catchErrors(companyController.saveCompany));


module.exports = router;
