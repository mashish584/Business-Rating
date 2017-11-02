const mongoose = require('mongoose');
const Company = mongoose.model('Company');

exports.home = (req,res)=>{
    res.render('index',{title:'Home'});
};

exports.addCompany = (req,res) => {
    const states = Object.keys(require('../data/states'));
    res.render('add-company',{title:'Add Company',states});
};

exports.getCompany = (req,res) => {
    res.render('company',{title:'Company'});
};

exports.saveCompany = async(req,res) => {
   await new Company(req.body).save();
   res.json({success:'Company Saved'});
   return;
};