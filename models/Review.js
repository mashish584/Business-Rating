const mongoose = require('mongoose');
mongoose.promise = global.promise;

const Schema = mongoose.Schema;
const reviewSchema = new Schema({
	review: {
		type:String,
		trim:true,
		required:'Please add review'
	},
	rating:{
		type:Number,
		min:1,
		max:5,
		default:1
	},
	reviewer:{
		type:mongoose.Schema.ObjectId,
		ref:'User'
	},
	company:{
		type:mongoose.Schema.ObjectId,
		ref:'Company'
	},
	createdAt:{
		type:Date,
		default:Date.now()
	}
});

function populate(next){
    this.populate('reviewer');
    next();
}


reviewSchema.pre('find',populate);
reviewSchema.pre('findOne',populate);

const Review = mongoose.model('Review',reviewSchema);
module.exports = Review;