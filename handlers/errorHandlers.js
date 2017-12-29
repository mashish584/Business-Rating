
/*
  Catch errors
  ------------
  We're using async await which is a feature of ES8 in our application and
  in order to catch errors related to our failed mongoose query we need this
  errorHandle to wrap our function to catch mongoose query error and through
  them to nexr piece of middleware with the data related to error.
  The other alternative we can use to catch these errors is to use
  try(){

  }catch(e){

  }
  block in our each function to bind query and catch erors.
*/


exports.catchErrors = (fn) => {
	return function(req, res, next){
		return fn(req, res, next).catch(next);
	}
};



/*
	404 Error Handler
	_________________

	Suppose we visit any route which is not declared yet.
	So, we will consider that error as a 404 error and will
	pass it to next error Handler.
*/

exports.notFound = (req, res, next) => {
	//create new error instance with message 'NOT FOUND'
	const err = new Error('Not Found');
	//set status to 404
	err.status = 404;
	//pass it to next errorHandler middleware
	next(err);
}


/*
	MongoDB Validations Error Handler
	_________________________________
	If we have any mongoDB validation error
	then we're going to show the error as a flash
*/

exports.ValidationErrors = (err, req, res, next) => {
	//Incase of error with name "user-exists"
	//go for flash
	if(err.name == "UserExistsError"){
		req.flash('error',err.message);
		res.redirect('back');
		return;
	}
	//call next 'errorHandler' middleware if we don't have 'errors' object in 'err'
	if(!err.errors) return next(err);
	//get all the keys from 'err.errors' object
	const errorKeys = Object.keys(err.errors);

	//loop through each key and set it on flash
	errorKeys.forEach(key => req.flash('error',err.errors[key].message));
	//redirect user to previous page
	res.redirect('back');
}


/*
   Error Handlers for Different Environment
   _________________________________________
   If we are in development mode we're going to show errors
   with stack and if we're on production mode we're only going
   to show the message to user.
*/

exports.EnvErrorHandler = (err, req, res, next) => {
	 // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.MODE === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if(process.env.MODE !== 'development'){
	  res.render('404',{title:'Error'});
	  return;
  }
  res.render('error',{title:'Error'});
}