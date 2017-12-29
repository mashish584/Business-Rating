
const mongoose = require('mongoose');


//Our node server should be on version 7.6+ because we're using async await feature of ES8 
const [major,minor] = process.versions.node.split('.').map(parseFloat);
if(major < 7 || (major === 7 && minor <= 5)){
	console.log("You are on old version of node update it please");
	process.exit();
}

//using 'dotenv' module to import our environment variables
require('dotenv').config({path:'variables.env'});

//connecting mongo db and handling any bad connections error
mongoose.connect(process.env.DB,{ useMongoClient: true });
//using Es6 promises with mongoose
mongoose.Promise = global.Promise;
// catching bad connection errors and logging all of them to console
mongoose.connection.on('error',(err) => {
	console.log(`Mongoose connection failed : ${err.message}`);
});

// models imports
require('./models/User');
require('./models/Company');
require('./models/Review');

//Start the app!

const app = require('./app');

app.set('port',process.env.PORT || 4040);
const server = app.listen(app.get('port'),() => {
	console.log(`App is running on port ${server.address().port}`);
});
