

exports.home = (req,res)=>{
    res.render('index',{title:'Home'});
};

exports.addCompany = (req,res) => {
    res.render('add-company',{title:'Add Company'})
};

exports.getCompany = (req,res) => {
    res.render('company',{title:'Company'})
};