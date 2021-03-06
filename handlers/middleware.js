
const mongoose = require('mongoose');
const User = mongoose.model('User');


/************************************
    Validation Middlewares
***********************************/

//middleware for user registration

exports.validateRegister = (req,res,next) => {
      req.sanitizeBody('username');
      req.checkBody('username','Please enter your name.').notEmpty();
      req.checkBody('username','Username must be greater than 4 characters.').isLength({min:5});
      req.checkBody('email','Please enter your email address.').notEmpty();
      req.checkBody('email','Email is not valid.').isEmail();
      req.checkBody('password','Please enter your password').notEmpty();
      req.checkBody('password','Password must be greater than 7 characters.').isLength({min:8});
      req.checkBody('confirm','Please confirm your password').notEmpty();
      req.checkBody('confirm','Confirm password not matched.').equals(req.body.password);
    
      //catch all validation errors
      const errors = req.validationErrors();
      if(errors){
        const message = errors[0].msg;
        req.flash('error',message);
        res.redirect('back');
        return;
      }
      next();
};

//middleware for company add form
exports.validateCompany = (req,res,next) => {
    req.sanitize('name').trim();
    req.checkBody('name','Please enter the name of a company').notEmpty();
    req.sanitize('contact').trim();
    req.checkBody('contact','Please enter the contact number').notEmpty();
    req.checkBody('contact','Contact number length should be equal to 10 digits').isLength({min:10,max:10});
    req.checkBody('contact','Invalid contact number').matches(/^[0-9]{1,10}$/);
    req.sanitize('about').trim();
    req.checkBody('about','Please tell us about your company.').notEmpty();
    req.checkBody('about','About text should be more than 75 characters.').isLength({min:75});
    const errors = req.validationErrors();
    if(errors){
      const message = errors[0].msg;
      res.json({error:message});
      return;
    }
    //extra validation
    if(!req.body.state || !req.body.city){
      res.json({error:'Please select state and city.'});
      return;
    }
    next();
};

//middleware for review form
exports.validateReview = (req,res,next) => {
  req.sanitize('review').trim();
  req.checkBody('review','Please write your review').notEmpty();
  const errors = req.validationErrors();
    if(errors){
      const message = errors[0].msg;
      req.flash('error',message);
      res.redirect('back');
      return;    
    }

  if(req.body.rating == "0"){
    req.flash('error','Please give rating');
    res.redirect('back');
    return;  
  }
  next();
};


//middleware to validate bio update
exports.validateBio = (req,res,next) => {
    req.sanitize('about').trim();
    req.checkBody('about','Bio is required.').notEmpty();
    req.checkBody('about','Bio length should be more than 50 charsacters').isLength({min:50});
    const errors = req.validationErrors();
    if(errors){
      const message = errors[0].msg;
      req.flash('error',message);
      res.redirect('back');
      return;    
    }
    next(); 
};

//middleware to validate pass
exports.validatePass = async(req,res,next) => {
    // req.checkBody('oldPassword','Old password is required.').notEmpty();
    req.checkBody('newPassword','New password is required.').notEmpty();
    req.checkBody('confirmPassword','Confirm password is required.').notEmpty();
    req.checkBody('newPassword','New Password should have length of 7 or more characters.').isLength({min:7});
    req.checkBody('confirmPassword','Password not matched.').equals(req.body.newPassword);
    const errors = req.validationErrors();
    if(errors){
      const message = errors[0].msg;
      res.json({error:message});
      return;
    }    
    next(); 
};

// middleware to validate confirm
exports.validateConfirm = (req,res,next) => {
  req.checkBody('password','Password required').notEmpty();
  req.checkBody('password','Password length should have 7 or more characters.').isLength({min:7});
  req.checkBody('confirm','Confirm Password required.').notEmpty();
  req.checkBody('confirm','Password not matched').equals(req.body.password);
  //catch all validation errors
  const errors = req.validationErrors();
  if(errors){
    const message = errors[0].msg;
    req.flash('error',message);
    res.redirect('back');
    return;
  }
  next();
};


//middleware to check empty fields in 
//login form
exports.validateAuth = (req,res,next) => {
  req.checkBody('email','Email or Password are required.').notEmpty();
  req.checkBody('password','Email or Password are required.').notEmpty();
   //catch all validation errors
   const errors = req.validationErrors();
   if(errors){
     const message = errors[0].msg;
     req.flash('error',message);
     res.redirect('back');
     return;
   }
   next();
};


/************************************
   Guards to protect pages
*************************************/

// middleware to allow user to access user 
//based routes otherwise redirect user to home
exports.authGuard = (req,res,next) => {
    if(req.isAuthenticated()){
      next();
      return;
    }
    req.flash('error','You don\'t have access to this page.');
    res.redirect('/');
    return;
  };
  
//middleware to stop loggedin user from accessing 
//signIn and signUp routes and redirect them to home
exports.unauthGuard = (req,res,next) => {
    if(!req.isAuthenticated()){
      next();
      return;
    }
    res.redirect('/home');
    return;
};