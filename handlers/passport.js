const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const FacebookStrategy = require('passport-facebook');
const promisify = require('es6-promisify');

passport.use(User.createStrategy());

passport.use(new FacebookStrategy({
   clientID: process.env.FB_ID,
   clientSecret : process.env.FB_SECRET,
   callbackURL: 'http://localhost:8080/auth/facebook/callback',
   profileFields: ['id','emails','name']
},
async function(accessToken,refreshToken,profile,cb){
    try{
        const data = profile._json;
        const user = await User.findOne({'fbid':data.id});
        if(user){
           return cb(null,user);
        }else{
            const body = {'username':data.first_name+" "+data.last_name,'email':data.email,'fb_id':data.id,'db_token':accessToken};
            const newUser = await new User(body).save();
            return cb(null,newUser);
        }
    }catch(error){
        console.log(error);
    }
})); 

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());