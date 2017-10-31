const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const FacebookStrategy = require('passport-facebook');

passport.use(User.createStrategy());
passport.use(new FacebookStrategy({
   clientID: process.env.FB_ID,
   clientSecret : process.env.FB_SECRET,
   callbackURL: 'http://localhost:8080/auth/facebook/callback',
   profileFields: ['id','emails','name']
},
function(accessToken,refreshToken,profile,cb){
    const data = profile._json;
    User.findOne({'fb_id':data.id},function(err,user){
        if(err){
            return cb(err);
        }

        if(user){
            return cb(null,user);
        }else{
            const new_user = new User({'username':data.first_name+" "+data.last_name,'fb_id':data.id,'fb_token':accessToken,'email':data.email});
            new_user.save(function(err){
                if(err){
                    return cb(err);
                }
                return cb(null,new_user);
            });
        }
    })
})); 

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());