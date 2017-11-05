
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.getProfile = async(req,res,next) => {
    try{
        let profile = await User.findOne({_id:req.params.id});
        res.render('profile',{title:'Profile',profile})
    }catch(error){
        next({message:"Not Found"});
    }
};