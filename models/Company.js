const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const companySchema = new Schema({
    name:{
        type:String,
        required: 'Please enter company name'
    },
    state:{
        type:String,
        required: 'Please select state'
    },
    city:{
        type:String,
        required: 'Please select city'
    },
    contact:{
        type:String,
        required:'Please enter contact number'
    },
    about:{
        type:String,
        required:'Please tell us about your company'
    },
    social:{
        facebook:String,
        google:String,
        website:String
    },
    photo:{
        type:String,
        required:'Please upload one image'
    },
    owner:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    employees:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'User'
        }
    ]
});

const Company = mongoose.model('Company',companySchema);

module.exports = companySchema;