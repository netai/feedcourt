var express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    engine = require('ejs-locals');
    
var config = require('./config/app'),
    controllers = require('./controllers'),
    api_controllers = require('./api'),
    routes = require('./routes');

var app = express();

var basePath = __dirname;

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(session({
  secret: config.sessionSecret,
  resave: true,
  saveUninitialized: true
}));
app.use(cookieParser());

routes.setup({
    'controllers': controllers,
    'api_controllers': api_controllers,
    'app': app
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });


module.exports = app;
