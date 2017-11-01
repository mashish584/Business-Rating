const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.promise = global.promise;
const passportLocalMongoose = require('passport-local-mongoose');

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
  fb_id:{
      type:String,
      unique:true
  },
  fb_token:{
      type:String,
      unique:true
  },
  google_id:{
      type:String,
      unique:true
  },
  google_token:{
      type:String,
      unique:true
  },
  createdAt :{
      type:Date,
      default:Date.now()
  }
});


userSchema.plugin(passportLocalMongoose,{usernameField:'email'});

const User = mongoose.model('User',userSchema);
module.exports = User;