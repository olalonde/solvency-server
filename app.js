
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  domain = require('./routes/domain'),
  engines = require('consolidate'),
  http = require('http'),
  path = require('path');

var app = express();

app.disable('x-powered-by');
app.engine('hbs', engines.handlebars);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hbs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.urlencoded());
  app.use(express.json());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/domain/:domain', domain.show);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
