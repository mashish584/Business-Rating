const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.promise = global.promise;
const passportLocalMongoose = require('passport-local-mongoose');
const md5 = require('md5');


const userSchema = new Schema({
  username:{
      type: String,
      required: 'Please enter your name',
      trim:true
  },
  email:{
      type: String,
      required: "Please enter your email address",
      unique:true,
      trim:true
  },
  fb_id:String,
  fb_token:String,
  google_id:String,
  google_token:String,
  createdAt :{
      type:Date,
      default:Date.now()
  }
});

userSchema.virtual('gravatar').get(function(){
	const hash = md5(this.email);
	return `https://gravatar.com/avatar/${hash}?s=200`;
});


userSchema.plugin(passportLocalMongoose,{
    usernameField:'email',
    errorMessages:{
        'UserExistsError': 'Email already registered.',
    }
});


const User = mongoose.model('User',userSchema);
module.exports = User;