
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, user = require('./routes/user')
, http = require('http')
, path = require('path');

var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 8080);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('my secret string'));
    //app.use(express.cookieSession());
    app.use(express.session({
        secret: 'my secret string',
        maxAge: 3600000
    }));
    
    app.use(function(req, res, next){
        res.locals.session_user = req.session.user;
        next();
    });
    
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

});

app.configure('development', function(){
    app.use(express.errorHandler());
    
});

//app.get('/', routes.index);
//app.get('/users', user.list);
require('./routes/index')(app);
require('./routes/user')(app);
require('./routes/session')(app);
require('./routes/articles')(app);

var dbURL = 'mongodb://localhost/express';
var db = require('mongoose').connect(dbURL);

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
