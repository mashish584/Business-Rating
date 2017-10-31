const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const passport = require('passport'); 

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

exports.login = (req,res) => {
  console.log(req.user);
  res.render('signin',{title:"LogIn"});
};

exports.register = (req,res) => {
  res.render('signup',{title:"SignUp"});
};

exports.signin = passport.authenticate('local',{
	failureRedirect : '/register',
	failureFlash : 'Faild Login!',
	successRedirect: '/home',
	successFlash : 'Successfully logged in'
});

exports.signup = async (req,res,next) => {
    const user = new User({username:req.body.username,email:req.body.email});
    const register = promisify(User.register,User);
    await register(user,req.body.password);
    next();
};