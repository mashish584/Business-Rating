const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const passport = require('passport'); 


exports.login = (req,res) => {
  res.render('signin',{title:"LogIn"});
};

exports.register = (req,res) => {
  res.render('signup',{title:"SignUp"});
};

exports.reset = (req,res) => {
  res.render('reset',{title:'Reset Password'});
  //need functionality
};

exports.logout = (req,res) => {
  req.logout();
  req.flash('success','Logout Success.');
  res.redirect('back');
}

exports.signin = passport.authenticate('local',{
	failureRedirect : '/',
	failureFlash : 'Username and Password combination not matched.',
	successRedirect: '/home',
	successFlash : 'Successfully logged in'
});

exports.signup = async (req,res,next) => {
    const user = new User({username:req.body.username,email:req.body.email});
    const register = promisify(User.register,User);
    await register(user,req.body.password);
    next();
};