const mongoose = require('mongoose');
const Company = mongoose.model('Company');
const Review = mongoose.model('Review');

exports.home = async(req,res)=>{
    //catch page number
    const page = req.query.page||1;
    const limit = 3;
    const skip = (page*limit)-limit; 
    const companies = await Company.find().skip(skip).limit(limit).sort({created:'desc'});
    const count = await Company.count();
    const pages = Math.ceil(count/limit);
    if(!companies.length){
      res.redirect(`/home?page=${pages}`);
      return;
    }
    res.render('index',{title:'Home',companies,page,pages});
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


exports.searchCompany = async(req,res) => {
  const company = await Company.find({
    $text:{
      $search:req.query.search
    }
  },{
    score:{$meta:'textScore'}
  }).sort(
     { 
       score: { $meta: "textScore" } 
      }
  );

  res.json({company});
};