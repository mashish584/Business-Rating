const mongoose = require('mongoose');
const Company = mongoose.model('Company');
const Review = mongoose.model('Review');

exports.home = async(req,res)=>{
    const companies = await Company.find({});
    res.render('index',{title:'Home',companies});
};

exports.addCompany = (req,res) => {
    const states = Object.keys(require('../data/states'));
    res.render('add-company',{title:'Add Company',states});
};

exports.getCompany = async(req,res) => {
    const company = await Company.findOne({_id:req.params.id});
    res.render('company',{title:'Company',company});
};

exports.saveCompany = async(req,res) => {
   req.body.owner = req.user._id;
   await new Company(req.body).save();
   res.json({success:'Company Saved'});
   return;
};

exports.addReview = async(req,res) => {
  req.body.reviewer = req.user._id;
  req.body.company = req.params.id;
  await new Review(req.body).save();
  req.flash('success','Review added');
  res.redirect('back');
};

exports.addEmployee = async(req,res) => {
  const exist = await Company.findOne({
                      employees:{
                        $in: [req.user._id]
                      }
                });
  const operator = exist?'$pull':'$addToSet';
  await Company.findByIdAndUpdate(req.params.id,{
                                    [operator]:{employees:req.user._id}
                                  });
  res.redirect('back');
};