const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const FacebookStrategy = require('passport-facebook');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(User.createStrategy());

passport.use(new FacebookStrategy({
   clientID: process.env.FB_ID,
   clientSecret : process.env.FB_SECRET,
   callbackURL: 'https://business-rating.herokuapp.com/auth/facebook/callback',
   profileFields: ['id','emails','name']
},
async function(accessToken,refreshToken,profile,cb){
    try{
        const data = profile._json;
        const user = await User.findOne({
                        $or:[
                            {'fb_id':data.id},
                            {'email':data.email}
                        ]
                    });
        if(user){
           return cb(null,user);
        }else{
            const body = {
                'username':data.first_name+" "+data.last_name,
                'email':data.email,
                'fb_id':data.id,
                'fb_token':accessToken
            };
            const newUser = await new User(body).save();
            return cb(null,newUser);
        }
    }catch(error){
        console.log(error);
    }
})); 

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_ID,
    clientSecret:process.env.GOOGLE_SECRET,
    callbackURL:"https://business-rating.herokuapp.com/auth/google/callback"
},
async function(accessToken,refreshToken,profile,cb){
    try{
        const data = profile._json;
        const user = await User.findOne({
                        $or:[
                                {'google_id':data.id},
                                {'email':data.emails[0].value}
                            ]
                    });
        if(user){
           return cb(null,user);
        }else{
            const body = {
                'username':data.displayName,
                'email':data.emails[0].value,'google_id':data.id,
                'google_token':accessToken
            };
            const newUser = await new User(body).save();
            return cb(null,newUser);
        }
    }catch(error){
        console.log(error);
    }
}));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());