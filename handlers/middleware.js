

// validation middlewares
exports.validateRegister = (req,res,next) => {
    req.sanitizeBody('username');
    req.checkBody('username','Please enter username.').notEmpty();
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

//middleware to check empty fields in 
//login form
exports.validateAuth = (req,res,next) => {
  req.checkBody('username','Username or Password are required.').notEmpty();
  req.checkBody('password','Username or Password are required.').notEmpty();
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