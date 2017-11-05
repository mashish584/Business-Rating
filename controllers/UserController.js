
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.getProfile = async(req,res,next) => {
    try{
        let profile = await User.findOne({_id:req.params.id});
        res.render('profile',{title:'Profile',profile})
    }catch(error){
        next({message:"Not Found"});
    }
};

exports.updateBio = async(req,res) => {
	const user = await User.findOneAndUpdate({_id:req.user._id});
	user.about = req.body.about;
	await user.save();
	req.flash('success','Bio Updated');
	res.redirect('back');
};

exports.updatePassword = async(req,res) => {
	
	try{
		const user = await User.findOne({_id:req.user._id});	
		const match = promisify(user.changePassword,user);
		await match(req.body.oldPassword,req.body.newPassword);
		res.json({'success':'Password changed.'})
		return;
	}catch(error){
		let message ;
		if(error.name == 'MissingPasswordError'){
		   const user = await User.findOne({_id:req.user._id});
		   const set = promisify(user.setPassword,user);
		   await set(req.body.newPassword);
		   res.json({'success':'Password changed.'})
		   return;
		}else if(error.name == 'IncorrectPasswordError'){
			message = "Old password is invalid.";
		} else{
			message = "Something went wrong";
		}
		res.json({'error':message});
	}
	
};