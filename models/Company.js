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
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

companySchema.index({
    name:'text',
    about:'text'
});

companySchema.virtual('reviews',{
    ref:'Review',
    localField:'_id',
    foreignField:'company'
});

companySchema.virtual('average').get(function(){
    let ratings =  this.reviews.map(review => {
        return review.rating;
    });
    if(ratings.length != "0"){
        let average = ratings.reduce((a,b)=> a+b);
        return average/ratings.length;
    }
    return 0;
});

function populate(next){
    this.populate('reviews');
    next();
}

companySchema.pre('find',populate);
companySchema.pre('findOne',populate);

const Company = mongoose.model('Company',companySchema);
module.exports = Company;