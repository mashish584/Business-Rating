const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const flash = require('connect-flash');
const favicon = require('serve-favicon');
const logger = require('morgan');
const validator = require('express-validator');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');


//importing helper files
const helper = require('./helpers.js');

// importing routes
const index = require('./routes/index');

//importing errorHandler
const errorHandler = require('./handlers/errorHandlers');

//storing express instance in app variable
const app = express();

// requiring passport 
require('./handlers/passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//Will logged each http request made by server on console with 'dev' format
app.use(logger('dev'));

//Make all form data available on req.body
app.use(bodyParser.json());
//help in passing nested form data
app.use(bodyParser.urlencoded({ extended: true }));

//store cookies coming with request in req.cookies 
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// using session
app.use(session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// express validator
app.use(validator());

// using flash
app.use(flash());

// pass variables to templates
app.use((req, res, next) => {
    res.locals.h = helper;
    res.locals.error = req.flash('error') || null;
    res.locals.success = req.flash('success') || null;
    res.locals.user = req.user || null;
    //call next peice of middleware
    next();
});

//routes
app.use('/', index);

// catch 404 and forward to error handler
app.use(errorHandler.notFound);

// error handler
app.use(errorHandler.ValidationErrors);

//Environments error
app.use(errorHandler.EnvErrorHandler);

//exporting our whole app whenever the application 'run'
module.exports = app;
