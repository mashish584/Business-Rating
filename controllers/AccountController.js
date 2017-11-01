const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const passport = require('passport'); 


exports.login = (req,res) => {
  console.log(req.user);
  res.render('signin',{title:"LogIn"});
};

exports.register = (req,res) => {
  res.render('signup',{title:"SignUp"});
};

exports.logout = (req,res) => {
  console.log("ss");
  req.logout();
  req.flash('success','Logout Success.');
  res.redirect('back');
}

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