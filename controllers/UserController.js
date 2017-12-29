
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const crypto = require('crypto');
const {sendMail} = require('../handlers/mail.js');

exports.getProfile = async(req,res,next) => {
    try{
        let profile = await User.findOne({_id:req.params.id});
        res.render('profile',{title:'Profile',profile})
    }catch(error){
        next({message:"Not Found"});
    }
};

exports.updateBio = async(req,res) => {
	const user = await User.findOne({_id:req.user._id});
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

exports.sendToken = async(req,res) => {
	try{

		const user = await User.findOne({email:req.body.email});
		if(!user){
			req.flash('success','Check your mail account.');
			res.redirect('back');
		}
		const token = crypto.createHmac('sha256', user._id.toString()).digest('hex');
		const expire = Date.now() + 60*60*1000;
		user.resetToken = token;
		user.resetExpire = expire;
		await user.save();
		
		const resetURL = `http://${req.headers.host}/user/reset/${token}`;
	
		//crate mail options
		let data = {
			email:req.body.email,
			subject:'Reset Password',
			text:`This is your reset password link ${resetURL} (Expire in 1 hour)`,
			html : `This is your reset password <a href=${resetURL}>link</a> (Expire in 1 hour)`
		};
	
		await sendMail(data);
		req.flash('success','Check your mail account');
		res.redirect('back');

	}catch(error){
		req.flash('error','Something went wrong.');
		res.redirect('back');
	}
};

exports.resetPassword = async(req,res) => {
	
	const user = await User.findOne({
		resetToken: req.params.token,
		resetExpire: {$gt:Date.now()}
	});

	if(!user){
		req.flash('error','Password reset token invalid or expired.');
		res.redirect('back');
	}

	res.render('reset',{title:'Reset Password'});

};

exports.changePassword = async (req,res) => {
	const user = await User.findOne({
		resetToken: req.params.token,
		resetExpire: {$gt:Date.now()}
	});

	if(!user){
		req.flash('error','Password reset token invalid or expired.');
		res.redirect('back');
	}

	const setPassword = promisify(user.setPassword,user);
	await setPassword(req.body.password);
	user.resetToken = undefined;
	user.resetExpire = undefined;
	await user.save();
	req.flash('success','Password rest successfully');
	res.redirect('/');
};