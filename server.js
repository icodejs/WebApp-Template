
var
express         = require('express'),
app             = express(),
redis           = require('redis'),
RedisStore      = require('connect-redis')(express),
routes          = require('./routes'),
conf            = require('./lib/config'),
oneWeek         = 60000 * 60 * 24 * 7,

sessionStore    = new RedisStore({
  host : conf.redis.host,
  port : conf.redis.port,
  pass : conf.redis.pass,
  db   : conf.redis.db
});


// -- Configuration --
app.configure(function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');

  app.locals({
    title  : conf.app.name,
    isLive : (process.env.NODE_ENV === 'production')
  });

  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser(conf.cookie.secret));
  app.use(express.session({
    store  : sessionStore,
    cookie : {
      maxAge   : oneWeek,
      httpOnly : false
    }
  }));
  app.use(express.favicon());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(function (err, req, res, next) {
    // handle all error here!
    var error = err.toString();

    throw (err);

    //res.render('error', { title: 'oops...', error: error });
  });
});

app.configure('development', function () {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
  app.use(express.errorHandler());
});


function requiresLogin(req, res, next) {
  if (req.session.user) {
    next();
  }
  else {
    res.redirect('/');
  }
}


/* videos */
app.get('/', function (req, res) {
  res.end('Hello World');
});


app.listen(4000);
