var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mochaTest = require('gulp-mocha');
var concat = require('gulp-concat');

gulp.task('lint', function(){
  return gulp.src(['client/**/*.js', 'server/**/*.js', 'gulpfile.js', '!client/lib/**'])
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'));
});

gulp.task('mochaTest', function(){
  return gulp.src(['tests/clientSpecs/clientSpecs.js', 'tests/serverSpecs/serverSpecs.js'])
      .pipe(mochaTest({
        bail: true
      }));
});

gulp.task('concat', function() {
  gulp.src(['**/*.js', '!client/lib/**', '!node_modules/**'])
    .pipe(concat({ path: 'newConcat.js'}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function(){
  gulp.watch(['client/**/*.js', 'server/**/*.js', 'gulpfile.js'], ['lint']);
});

gulp.task('default', ['lint', 'mochaTest', 'concat', 'watch']);
gulp.task('travis', ['lint', 'mochaTest']);

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mochaTest = require('gulp-mocha');
var concat = require('gulp-concat');

gulp.task('lint', function(){
  return gulp.src(['client/**/*.js', 'server/**/*.js', 'gulpfile.js', '!client/lib/**'])
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'));
});

gulp.task('mochaTest', function(){
  return gulp.src(['tests/clientSpecs/clientSpecs.js', 'tests/serverSpecs/serverSpecs.js'])
      .pipe(mochaTest({
        bail: true
      }));
});

gulp.task('concat', function() {
  gulp.src(['**/*.js', '!client/lib/**', '!node_modules/**'])
    .pipe(concat({ path: 'newConcat.js'}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function(){
  gulp.watch(['client/**/*.js', 'server/**/*.js', 'gulpfile.js'], ['lint']);
});

gulp.task('default', ['lint', 'mochaTest', 'concat', 'watch']);
gulp.task('travis', ['lint', 'mochaTest']);

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mochaTest = require('gulp-mocha');
var concat = require('gulp-concat');

gulp.task('lint', function(){
  return gulp.src(['client/**/*.js', 'server/**/*.js', 'gulpfile.js', '!client/lib/**'])
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'));
});

gulp.task('mochaTest', function(){
  return gulp.src(['tests/clientSpecs/clientSpecs.js', 'tests/serverSpecs/serverSpecs.js'])
      .pipe(mochaTest({
        bail: true
      }));
});

gulp.task('concat', function() {
  gulp.src(['**/*.js', '!client/lib/**', '!node_modules/**'])
    .pipe(concat({ path: 'newConcat.js'}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function(){
  gulp.watch(['client/**/*.js', 'server/**/*.js', 'gulpfile.js'], ['lint']);
});

gulp.task('default', ['lint', 'mochaTest', 'concat', 'watch']);
gulp.task('travis', ['lint', 'mochaTest']);

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mochaTest = require('gulp-mocha');
var concat = require('gulp-concat');

gulp.task('lint', function(){
  return gulp.src(['client/**/*.js', 'server/**/*.js', 'gulpfile.js', '!client/lib/**'])
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'));
});

gulp.task('mochaTest', function(){
  return gulp.src(['tests/clientSpecs/clientSpecs.js', 'tests/serverSpecs/serverSpecs.js'])
      .pipe(mochaTest({
        bail: true
      }));
});

gulp.task('concat', function() {
  gulp.src(['**/*.js', '!client/lib/**', '!node_modules/**'])
    .pipe(concat({ path: 'newConcat.js'}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function(){
  gulp.watch(['client/**/*.js', 'server/**/*.js', 'gulpfile.js'], ['lint']);
});

gulp.task('default', ['lint', 'mochaTest', 'concat', 'watch']);
gulp.task('travis', ['lint', 'mochaTest']);

// handles the errors in the server
module.exports = {
  errorLogger: function (error, req, res, next) {
    console.error(error.stack);
    next(error);
  },
  errorHandler: function (error, req, res, next) {
    // send error message to client
    // message for gracefull error handling on app
    res.send(500, {error: error.message});
  }
};
var express = require('express'); // express server
var bodyParser = require('body-parser'); // use body-parser for getting body of incoming requests
var mongoose = require('mongoose'); // use mongoose for user authentication routes

// request handlers
var user = require('./users/user-controller.js'); // user authentication routes
var errors = require('./error-handlers.js');

var app = express();

// starting mongoDB connection
var mongoUrl = process.env.PORT ? "mongodb://webEKGAPI:yhXk8EPXDSfy@ds051160.mongolab.com:51160/ekgapi" : 'mongodb://localhost/ekgtracker';
mongoose.connect(mongoUrl);

// serves the static contents in the client folder
app.use(express.static(__dirname + '/../client'));

// for every incoming request, the following will parse the 
// body of the request for its contents before passing them
// off to other request handlers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// user-authentication routes, handles signin, signup, and checkAuth
app.post('/users/signin', user.signin);
app.post('/users/signup', user.signup);
app.get('/users/signedin', user.checkAuth);

// if incoming request is not pinging a user authentication route
// then we make sure they are signed in by getting the token from
// the header
app.use(user.decode);

// if there are errors from the server, use these to send back the errors
app.use(errors.errorLogger);
app.use(errors.errorHandler);

// listens to incoming requests
app.listen(process.env.PORT || '8080');
console.log("Server is listening...");

// exporting the express server
module.exports = app;

angular.module('ekg.home', [

])

.controller('MainController', function ($scope, $http) {

  $http.get('/sampleData/sample1snippet.json')
    .success(function(result){
      $scope.sampleData1 = result;
      $scope.renderer = 'line';
    })
    .catch(function(error){
      console.log('http get error', error);
    });

  $http.get('/sampleData/sample1.json')
    .success(function(result){
      $scope.sampleData2 = result;
      $scope.renderer = 'line';
    })
    .catch(function(error){
      console.log('http get error', error);
    });

});

angular.module('ekg')
.directive('rickshawChart', function () {
  return {
    scope: {
      data: '=',
      renderer: '='
    },
    template: '<div></div>',
    restrict: 'E',
    link: function postLink(scope, element, attrs) {
      scope.$watchCollection('[data, renderer]', function(newVal, oldVal){
        if(!newVal[0]){
          return;
        }

        element[0].innerHTML ='';

        var graph = new Rickshaw.Graph({
          element: element[0],
          width: attrs.width,
          height: attrs.height,
          series: [{data: scope.data, color: attrs.color}],
          renderer: scope.renderer
        });

        graph.render();
      });
    }
  };
});

;(function(){
  'use strict';

  angular.module('ekg', [
    'ekg.auth',
    'ekg.home',
    'ui.router'
  ])

  .run(function($rootScope, $state, Auth){

    $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams){
      if (toState.authenticate && !Auth.isAuth()){
        // User isn’t authenticated but the state requires authentication
        $state.transitionTo('signin');
        event.preventDefault(); 
      }
    });

  })

  .config(function($stateProvider, $urlRouterProvider, $httpProvider){

    // AngularUI Router uses the concept of states
    // Documentation: https://github.com/angular-ui/ui-router
    $stateProvider

      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainController',
        authenticate: true
      })

      .state('signin', {
        url: '/signin',
        templateUrl: '/auth/signin.html',
        controller: 'AuthController'
      })

      .state('signup', {
        url: '/signup',
        templateUrl: '/auth/signup.html',
        controller: 'AuthController'
      });

    // the default route should point to the home page
    // which contains the graphs
    $urlRouterProvider.otherwise('/home');

    //We add $httpInterceptor into the array
    $httpProvider.interceptors.push('AttachTokens');

  })

  .factory('AttachTokens', function ($window) {
    // this is an $httpInterceptor. its job is to stop all out going request
    // then look in local storage and find the user's token
    // then add it to the header so the server can validate the request
    var attach = {
      request: function (object) {
        var jwt = $window.localStorage.getItem('com.ekgtracker');
        if (jwt) {
          object.headers['x-access-token'] = jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        return object;
      }
    };
    return attach;
  });
})();

angular.module('ekg.auth', [

])

.controller('AuthController', function ($scope, $window, $state, Auth) {

  $scope.user = {};

  $scope.signin = function () {
    Auth.signin($scope.user)
      .then(function (token) {
        if (token) {
          $window.localStorage.setItem('com.ekgtracker', token);
          $state.transitionTo('home');
        } else {
          $state.transitionTo('signin');
          alert('Username or password was incorrect. Please try again.');
        }
      })
      .catch(function (error) {
        alert('Error in signin function: ', error);
      });
  };

  $scope.signup = function (isValid) {
    if (isValid){
      Auth.signup($scope.user)
        .then(function (token) {
          if (token) {
            $window.localStorage.setItem('com.ekgtracker', token);
            $state.transitionTo('home');
          } else {
            $state.transitionTo('signup');
            alert('Username is already taken. Please select different username.');
          }
        })
        .catch(function (error) {
          alert('Error in signup function: ', error);
        });
    } else {
      alert('Username must be between 4 and 140 characters long and password must be between 8 and 140 characters long.');
    }
  };

  $scope.signout = Auth.signout;

})

.factory('Auth', function ($http, $state, $window) {
 
   var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/users/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/users/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.ekgtracker');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.ekgtracker');
    $state.transitionTo('signin');
  };

  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };

});
var User = require('./user-model.js'),
    Q    = require('q'),
    jwt  = require('jwt-simple');

module.exports = {

  // sign-in function
  signin: function (req, res, next) {
    var username = req.body.username,
        password = req.body.password;

    var findUser = Q.nbind(User.findOne, User);
    findUser({username: username})
      .then(function (user) {
        if (!user) {
          // generates an error if user is not found in the system
          next(new Error('User does not exist'));
        } else {
          return user.comparePasswords(password)
            .then(function(foundUser) {
              if (foundUser) {
                var token = jwt.encode(user, 'secret');
                // responds with a token when the user is found in the system
                res.json({token: token});
              } else {
                return next(new Error('No user'));
              }
            });
        }
      })
      .fail(function (error) {
        next(error);
      });
  }, //end signin

  // sign-up function
  signup: function (req, res, next) {
    var username  = req.body.username,
        password  = req.body.password,
        create,
        newUser;

    var findOne = Q.nbind(User.findOne, User);

    // check to see if user already exists
    findOne({username: username})
      .then(function(user) {
        if (user) {
          // errors when when the user does already exist
          next(new Error('User already exist!'));
        } else {
          // make a new user if one doesn't exist
          create = Q.nbind(User.create, User);
          newUser = {
            username: username,
            password: password
          };
          return create(newUser);
        }
      })
      .then(function (user) {
        // create token to send back for auth using jwt
        var token = jwt.encode(user, 'secret');
        res.json({token: token});
      })
      .fail(function (error) {
        next(error);
      });
  }, //end signup

  // checking to see if the user is authenticated
  // grab the token in the header is any
  // then decode the token, which we end up being the user object
  // check to see if that user exists in the database
  checkAuth: function (req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) {
      next(new Error('No token'));
    } else {
      var user = jwt.decode(token, 'secret');
      var findUser = Q.nbind(User.findOne, User);
      findUser({username: user.username})
        .then(function (foundUser) {
          if (foundUser) {
            res.send(200);
          } else {
            res.send(401);
          }
        })
        .fail(function (error) {
          next(error);
        });
    }
  }, //end checkAuth

  // this is the middleware function that will decode
  // the username that identifies the user from which
  // the incoming request is coming
  decode: function (req, res, next) {
    
    var token = req.headers['x-access-token'];
    var user;
    if (!token) {
      // send forbidden if a token is not provided
      return res.send(403); 
    }
    try {
      // decode token and attach user to the request
      // for use inside our controllers
      user = jwt.decode(token, 'secret');
      req.username = user.username;
      next();
    } catch(error) {
      return next(error);
    }

  }//end decode

};
var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt-nodejs'),
    Q        = require('q'),
    SALT_WORK_FACTOR  = 10;

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  salt: String
});

UserSchema.methods.comparePasswords = function (candidatePassword) {
  var defer = Q.defer();
  var savedPassword = this.password;
  bcrypt.compare(candidatePassword, savedPassword, function (err, isMatch) {
    if (err) {
      defer.reject(err);
    } else {
      defer.resolve(isMatch);
    }
  });
  return defer.promise;
};

UserSchema.pre('save', function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }

      // override the cleartext password with the hashed one
      user.password = hash;
      user.salt = salt;
      next();
    });
  });
});

module.exports = mongoose.model('users', UserSchema);
var expect = require('chai').expect;

describe('Client Test', function(){
  it('should run a fake test', function(){
    expect(3).to.equal(3);
  });
});
var expect = require('chai').expect;
var request = require('request');

describe('Server Test', function(){
  it('should create a fake server test', function(){
    expect('server').to.equal('server');
  });
});
// handles the errors in the server
module.exports = {
  errorLogger: function (error, req, res, next) {
    console.error(error.stack);
    next(error);
  },
  errorHandler: function (error, req, res, next) {
    // send error message to client
    // message for gracefull error handling on app
    res.send(500, {error: error.message});
  }
};
var express = require('express'); // express server
var bodyParser = require('body-parser'); // use body-parser for getting body of incoming requests

// request handlers
var user = require('./users/user-controller.js'); // user authentication routes
var data = require('./data/data-controllers.js'); // data query routes
var errors = require('./error-handlers.js'); // error handlers

var app = express();

// serves the static contents in the client folder
app.use(express.static(__dirname + '/../client'));

// for every incoming request, the following will parse the 
// body of the request for its contents before passing them
// off to other request handlers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// user-authentication routes, handles signin, signup, and checkAuth
app.post('/users/signin', user.signin);
app.post('/users/signup', user.signup);
app.get('/users/signedin', user.checkAuth);

// if incoming request is not pinging a user authentication route
// then we make sure they are signed in by getting the token from
// the header
app.use(user.decode);

// these routes are for data queries
app.get('/users/data', data.getData);

// if there are errors from the server, use these to send back the errors
app.use(errors.errorLogger);
app.use(errors.errorHandler);

// listens to incoming requests
app.listen(process.env.PORT || '8080');
console.log("Server is listening...");

// exporting the express server
module.exports = app;

;(function(){
  'use strict';

  angular.module('ekg', [
    'ekg.auth',
    'ekg.home',
    'ui.router'
  ])

  .run(function($rootScope, $state, Auth){

    $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams){
      if (toState.authenticate && !Auth.isAuth()){
        // User isn’t authenticated but the state requires authentication
        $state.transitionTo('signin');
        event.preventDefault(); 
      }
    });

  })

  .config(function($stateProvider, $urlRouterProvider, $httpProvider){

    // AngularUI Router uses the concept of states
    // Documentation: https://github.com/angular-ui/ui-router
    $stateProvider

      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainController',
        authenticate: true
      })

      .state('signin', {
        url: '/signin',
        templateUrl: '/auth/signin.html',
        controller: 'AuthController'
      })

      .state('signup', {
        url: '/signup',
        templateUrl: '/auth/signup.html',
        controller: 'AuthController'
      });

    // the default route should point to the home page
    // which contains the graphs
    $urlRouterProvider.otherwise('/home');

    //We add $httpInterceptor into the array
    $httpProvider.interceptors.push('AttachTokens');

  })

  .factory('AttachTokens', function ($window) {
    // this is an $httpInterceptor. its job is to stop all out going request
    // then look in local storage and find the user's token
    // then add it to the header so the server can validate the request
    var attach = {
      request: function (object) {
        var jwt = $window.localStorage.getItem('com.ekgtracker');
        if (jwt) {
          object.headers['x-access-token'] = jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        return object;
      }
    };
    return attach;
  });
})();

angular.module('ekg.auth', [

])

.controller('AuthController', function ($scope, $window, $state, Auth) {

  $scope.user = {};

  $scope.signin = function () {
    Auth.signin($scope.user)
      .then(function (token) {
        if (token) {
          $window.localStorage.setItem('com.ekgtracker', token);
          $state.transitionTo('home');
        } else {
          $state.transitionTo('signin');
          alert('Username or password was incorrect. Please try again.');
        }
      })
      .catch(function (error) {
        alert('Error in signin function: ', error);
      });
  };

  $scope.signup = function (isValid) {
    if (isValid){
      Auth.signup($scope.user)
        .then(function (token) {
          if (token) {
            $window.localStorage.setItem('com.ekgtracker', token);
            $state.transitionTo('home');
          } else {
            $state.transitionTo('signup');
            alert('Username is already taken. Please select different username.');
          }
        })
        .catch(function (error) {
          alert('Error in signup function: ', error);
        });
    } else {
      alert('Username must be between 4 and 140 characters long and password must be between 8 and 140 characters long.');
    }
  };

  $scope.signout = Auth.signout;

})

.factory('Auth', function ($http, $state, $window) {
 
   var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/users/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/users/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.ekgtracker');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.ekgtracker');
    $state.transitionTo('signin');
  };

  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };

});
angular.module('ekg.home', [
  'ekg.auth'
])

.controller('MainController', function ($scope, DataGetter, Auth) {

  DataGetter.getData(true)
    .success(function(result){
      $scope.sampleData1 = result;
      $scope.renderer = 'line';
    })
    .catch(function(error){
      console.log('http get error', error);
    });

  DataGetter.getData()
    .success(function(result){
      $scope.sampleData2 = result;
      $scope.renderer = 'line';
    })
    .catch(function(error){
      console.log('http get error', error);
    });

  $scope.getData = function(dayOfWeek, hour, min) {
    DataGetter.getData(false, dayOfweek, hour, min)
      .success(function(result){
        $scope.sampleData1 = result;
        $scope.renderer = 'line';
      })
      .catch(function(error){
        console.log('http get error', error);
      });
  };

  $scope.signout = Auth.signout;
  
})

.factory('DataGetter', function ($http) {

  return {
    getData: function(large, dayOfWeek, hour, min) {
      if (large) {
        return $http.get('/users/data');
      } else {
        return $http.get('/users/data');
      }
    }
  };

});

angular.module('ekg')
.directive('rickshawChart', function () {
  return {
    scope: {
      data: '=',
      renderer: '='
    },
    template: '<div></div>',
    restrict: 'E',
    link: function postLink(scope, element, attrs) {
      scope.$watchCollection('[data, renderer]', function(newVal, oldVal){
        if(!newVal[0]){
          return;
        }

        element[0].innerHTML ='';

        var graph = new Rickshaw.Graph({
          element: element[0],
          width: attrs.width,
          height: attrs.height,
          series: [{data: scope.data, color: attrs.color}],
          renderer: scope.renderer
        });

        graph.render();
      });
    }
  };
});

// connect to the Microsoft SQL Server instance on Azure VM
var mssql = require('mssql');
var config = {
  user: 'ekgwebapp',
  password: 'ekgsqlserver1MSSS',
  server: 'ekgmsss.cloudapp.net',
  port: 1433,
  database: 'SampleData',
  options: {
    encrypt: true
  }
};

module.exports = {

  getData: function(req, res, next){
    // the time property in the request body should be an object 
    // that contains three properties: day of week (a number
    // between 1 and 7 with 1 = Monday, 7 = Sunday), hour (a number
    // between 0 and 23), and minute (a number between 0 and 59) 
    var startTime = req.body.time;

    // the username was put onto the request by the decode middleware
    var username = req.username;

    // query database for the data for data from that user
    mssql.connect(config, function(err){
      // passes any errors to the error handler
      if (err) next(new Error(err));

      var request = new mssql.Request();
      request.query('select x, y1 as y, y2 from SampleData.dbo.chfdb_chf01_275_processed', function(err, results){
        // passes any errors to the error handler
        if (err) next(new Error(err));
        res.json(results);
      });

    });           
  }
  
};
// starting mongoDB connection
var mongoose = require('mongoose');
var mongoUrl = process.env.PORT ? "mongodb://webEKGAPI:yhXk8EPXDSfy@ds051160.mongolab.com:51160/ekgapi" : 'mongodb://localhost/ekgtracker';
mongoose.connect(mongoUrl);

var User = require('./user-model.js'), // user-schema
    Q    = require('q'),  // promises library
    jwt  = require('jwt-simple'); // json web tokens

module.exports = {

  // sign-in function
  signin: function (req, res, next) {
    var username = req.body.username,
        password = req.body.password;

    var findUser = Q.nbind(User.findOne, User);
    findUser({username: username})
      .then(function (user) {
        if (!user) {
          // generates an error if user is not found in the system
          next(new Error('User does not exist'));
        } else {
          return user.comparePasswords(password)
            .then(function(foundUser) {
              if (foundUser) {
                var token = jwt.encode(user, 'secret');
                // responds with a token when the user is found in the system
                res.json({token: token});
              } else {
                return next(new Error('No user'));
              }
            });
        }
      })
      .fail(function (error) {
        next(error);
      });
  }, //end signin

  // sign-up function
  signup: function (req, res, next) {
    var username  = req.body.username,
        password  = req.body.password,
        create,
        newUser;

    var findOne = Q.nbind(User.findOne, User);

    // check to see if user already exists
    findOne({username: username})
      .then(function(user) {
        if (user) {
          // errors when when the user does already exist
          next(new Error('User already exist!'));
        } else {
          // make a new user if one doesn't exist
          create = Q.nbind(User.create, User);
          newUser = {
            username: username,
            password: password
          };
          return create(newUser);
        }
      })
      .then(function (user) {
        // create token to send back for auth using jwt
        var token = jwt.encode(user, 'secret');
        res.json({token: token});
      })
      .fail(function (error) {
        next(error);
      });
  }, //end signup

  // checking to see if the user is authenticated
  // grab the token in the header is any
  // then decode the token, which we end up being the user object
  // check to see if that user exists in the database
  checkAuth: function (req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) {
      next(new Error('No token'));
    } else {
      var user = jwt.decode(token, 'secret');
      var findUser = Q.nbind(User.findOne, User);
      findUser({username: user.username})
        .then(function (foundUser) {
          if (foundUser) {
            res.send(200);
          } else {
            res.send(401);
          }
        })
        .fail(function (error) {
          next(error);
        });
    }
  }, //end checkAuth

  // this is the middleware function that will decode
  // the username that identifies the user from which
  // the incoming request is coming
  decode: function (req, res, next) {
    
    var token = req.headers['x-access-token'];
    var user;
    if (!token) {
      // send forbidden if a token is not provided
      return res.send(403); 
    }
    try {
      // decode token and attach user to the request
      // for use inside our controllers
      user = jwt.decode(token, 'secret');
      req.username = user.username;
      next();
    } catch(error) {
      return next(error);
    }

  }//end decode

};
var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt-nodejs'),
    Q        = require('q'),
    SALT_WORK_FACTOR  = 10;

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  salt: String
});

UserSchema.methods.comparePasswords = function (candidatePassword) {
  var defer = Q.defer();
  var savedPassword = this.password;
  bcrypt.compare(candidatePassword, savedPassword, function (err, isMatch) {
    if (err) {
      defer.reject(err);
    } else {
      defer.resolve(isMatch);
    }
  });
  return defer.promise;
};

UserSchema.pre('save', function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }

      // override the cleartext password with the hashed one
      user.password = hash;
      user.salt = salt;
      next();
    });
  });
});

module.exports = mongoose.model('users', UserSchema);
var expect = require('chai').expect;

describe('Client Test', function(){
  it('should run a fake test', function(){
    expect(3).to.equal(3);
  });
});
var expect = require('chai').expect;
var request = require('request');

describe('Server Test', function(){
  it('should create a fake server test', function(){
    expect('server').to.equal('server');
  });
});
// Handles the errors on the server
module.exports = {
  errorLogger: function (error, req, res, next) {
    console.error(error.stack);
    next(error);
  },
  errorHandler: function (error, req, res, next) {
    // Send error message to client
    res.send(500, {error: error.message});
  }
};
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Request handlers
// user authentication routes
var user = require('./users/user-controller.js');
// Data query routes
// var data = require('./data/data-controllers.js');
var errors = require('./error-handlers.js');

var app = express();

// Python server connection
// var python = require('./python/pythonComm.js');

// Sends some data to Python, Python squares it - this is simply part
// of testing the python connection and can be removed later
// python.invoke("processData", [1,2,3], function(error, res, more) {
  // if(error){
    // throw error;
//   } 
//   console.log(res);
// }); 


// MongoDB connection
var mongoUrl = process.env.PORT ? "mongodb://webEKGAPI:yhXk8EPXDSfy@ds051160.mongolab.com:51160/ekgapi" : 'mongodb://localhost/ekgtracker';

mongoose.connect(mongoUrl);

app.use(express.static(__dirname + '/../client'));

// For every incoming request, the following will parse the 
// body of the request for its contents before passing them
// off to the other request handlers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// User-authentication routes, handles signin, signup, and checkAuth
app.post('/users/signin', user.signin);
app.post('/users/signup', user.signup);
app.get('/users/signedin', user.checkAuth);

// If incoming request is not pinging a user authentication route
// then we make sure they are signed in by getting the token from
// the header
app.use(user.decode);

// These routes are for data queries
// app.get('/users/data', data.getData);

// If there are errors from the server, use these to send back the errors
app.use(errors.errorLogger);
app.use(errors.errorHandler);

app.listen(process.env.PORT || '8080');
console.log("Server is listening...");

module.exports = app;

;(function(){
  'use strict';

  angular.module('ekg', [
    'ekg.auth',
    'ekg.home',
    'ui.router'
  ])

  .run(function($rootScope, $state, Auth){

    $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams){
      if (toState.authenticate && !Auth.isAuth()){
        // User isn’t authenticated but the state requires authentication
        $state.transitionTo('signin');
        event.preventDefault(); 
      }
    });

  })

  .config(function($stateProvider, $urlRouterProvider, $httpProvider){

    // AngularUI Router uses the concept of states
    // Documentation: https://github.com/angular-ui/ui-router
    $stateProvider

      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainController',
        authenticate: true
      })

      .state('signin', {
        url: '/signin',
        templateUrl: '/auth/signin.html',
        controller: 'AuthController'
      })

      .state('signup', {
        url: '/signup',
        templateUrl: '/auth/signup.html',
        controller: 'AuthController'
      });

    // The default route should point to the home page
    // which contains the graphs
    $urlRouterProvider.otherwise('/home');

    //We add $httpInterceptor into the array
    $httpProvider.interceptors.push('AttachTokens');

  })

  .factory('AttachTokens', function ($window) {
    // This is an $httpInterceptor. Its job is to stop all out going requests
    // then look in local storage and find the user's token.
    // Then, add it to the header so the server can validate the request
    var attach = {
      request: function (object) {
        var jwt = $window.localStorage.getItem('com.ekgtracker');
        if (jwt) {
          object.headers['x-access-token'] = jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        return object;
      }
    };
    return attach;
  });
})();

angular.module('ekg.auth', [])

.controller('AuthController', function ($scope, $window, $state, Auth) {

  $scope.user = {};

  $scope.signin = function () {
    Auth.signin($scope.user)
      .then(function (token) {
        if (token) {
          $window.localStorage.setItem('com.ekgtracker', token);
          $state.transitionTo('home');
        } else {
          $state.transitionTo('signin');
          alert('Username or password was incorrect. Please try again.');
        }
      })
      .catch(function (error) {
        alert('Error in signin function: ', error);
      });
  };

  $scope.signup = function (isValid) {
    if (isValid){
      Auth.signup($scope.user)
        .then(function (token) {
          if (token) {
            $window.localStorage.setItem('com.ekgtracker', token);
            $state.transitionTo('home');
          } else {
            $state.transitionTo('signup');
            alert('Username is already taken. Please select different username.');
          }
        })
        .catch(function (error) {
          alert('Error in signup function: ', error);
        });
    } else {
      alert('Username must be between 4 and 140 characters long and password must be between 8 and 140 characters long.');
    }
  };

  $scope.signout = Auth.signout;

})

.factory('Auth', function ($http, $state, $window) {
 
   var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/users/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/users/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.ekgtracker');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.ekgtracker');
    $state.transitionTo('signin');
  };

  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };

});
angular.module('ekg.home', [
  'ekg.auth'
])

.controller('MainController', function ($scope, DataGetter, Auth) {

  DataGetter.getData(true)
    .success(function(result){
      $scope.sampleData1 = result;
      $scope.renderer = 'line';
    })
    .catch(function(error){
      console.log('http get error', error);
    });

  DataGetter.getData()
    .success(function(result){
      $scope.sampleData2 = result;
      $scope.renderer = 'line';
    })
    .catch(function(error){
      console.log('http get error', error);
    });

  $scope.getData = function(dayOfWeek, hour, min) {
    DataGetter.getData(false, dayOfweek, hour, min)
      .success(function(result){
        $scope.sampleData1 = result;
        $scope.renderer = 'line';
      })
      .catch(function(error){
        console.log('http get error', error);
      });
  };

  $scope.signout = Auth.signout;
  
})

  // Retrieves ekg data from node server
.factory('DataGetter', function ($http) {

  return {
    getData: function(large, dayOfWeek, hour, min) {
      if (large) {
        return $http.get('/../sampleData/sample1snippet.json');
      } else {
        return $http.get('/../sampleData/sample1.json');
      }
    }
  };

});

angular.module('ekg')
.directive('rickshawChart', function () {
  return {
    scope: {
      data: '=',
      renderer: '='
    },
    template: '<div></div>',
    restrict: 'E',
    link: function postLink(scope, element, attrs) {
      scope.$watchCollection('[data, renderer]', function(newVal, oldVal){
        
        if(!newVal[0]){
          return;
        }

        element[0].innerHTML ='';

        var graph = new Rickshaw.Graph({
          element: element[0],
          width: attrs.width,
          height: attrs.height,
          series: [{data: scope.data, color: attrs.color}],
          renderer: scope.renderer
        });

        graph.render();
      });
    }
  };
});

module.exports = {

  getData: function(req, res, next){

    // the time property in the request body should be an object 
    // that contains three properties: day of week (a number
    // between 1 and 7 with 1 = Monday, 7 = Sunday), hour (a number
    // between 0 and 23), and minute (a number between 0 and 59) 
    var startTime = req.body.time;

    // the username was put onto the request by the decode middleware
    var username = req.username;

    // query database for the data for data from that user
    // INSERT CODE TO PING SQL DATABASE HERE


  }
  
};
var zerorpc = require("zerorpc");

var client = new zerorpc.Client();
client.connect("tcp://ekg-python12.cloudapp.net:4242");

// checks whether connection to Python is present
client.invoke("hello", "Node!", function(error, res, more) {
    if(error){
      throw error;
    }
    console.log("Response from Python:", res);
});

module.exports = client;
var User = require('./user-model.js'),
    Q    = require('q'),
    jwt  = require('jwt-simple');

module.exports = {

  // sign-in function
  signin: function (req, res, next) {
    var username = req.body.username,
        password = req.body.password;

    var findUser = Q.nbind(User.findOne, User);
    findUser({username: username})
      .then(function (user) {
        if (!user) {
          // generates an error if user is not found in the system
          next(new Error('User does not exist'));
        } else {
          return user.comparePasswords(password)
            .then(function(foundUser) {
              if (foundUser) {
                var token = jwt.encode(user, 'secret');
                // responds with a token when the user is found in the system
                res.json({token: token});
              } else {
                return next(new Error('No user'));
              }
            });
        }
      })
      .fail(function (error) {
        next(error);
      });
  }, //end signin

  // sign-up function
  signup: function (req, res, next) {
    var username  = req.body.username,
        password  = req.body.password,
        create,
        newUser;

    var findOne = Q.nbind(User.findOne, User);

    // check to see if user already exists
    findOne({username: username})
      .then(function(user) {
        if (user) {
          // errors when when the user does already exist
          next(new Error('User already exist!'));
        } else {
          // make a new user if one doesn't exist
          create = Q.nbind(User.create, User);
          newUser = {
            username: username,
            password: password
          };
          return create(newUser);
        }
      })
      .then(function (user) {
        // create token to send back for auth using jwt
        var token = jwt.encode(user, 'secret');
        res.json({token: token});
      })
      .fail(function (error) {
        next(error);
      });
  }, //end signup

  // checking to see if the user is authenticated
  // grab the token in the header is any
  // then decode the token, which we end up being the user object
  // check to see if that user exists in the database
  checkAuth: function (req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) {
      next(new Error('No token'));
    } else {
      var user = jwt.decode(token, 'secret');
      var findUser = Q.nbind(User.findOne, User);
      findUser({username: user.username})
        .then(function (foundUser) {
          if (foundUser) {
            res.send(200);
          } else {
            res.send(401);
          }
        })
        .fail(function (error) {
          next(error);
        });
    }
  }, //end checkAuth

  // this is the middleware function that will decode
  // the username that identifies the user from which
  // the incoming request is coming
  decode: function (req, res, next) {
    
    var token = req.headers['x-access-token'];
    var user;
    if (!token) {
      // send forbidden if a token is not provided
      return res.send(403); 
    }
    try {
      // decode token and attach user to the request
      // for use inside our controllers
      user = jwt.decode(token, 'secret');
      req.username = user.username;
      next();
    } catch(error) {
      return next(error);
    }

  }//end decode

};
var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt-nodejs'),
    Q        = require('q'),
    SALT_WORK_FACTOR  = 10;

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  salt: String
});

UserSchema.methods.comparePasswords = function (candidatePassword) {
  var defer = Q.defer();
  var savedPassword = this.password;
  bcrypt.compare(candidatePassword, savedPassword, function (err, isMatch) {
    if (err) {
      defer.reject(err);
    } else {
      defer.resolve(isMatch);
    }
  });
  return defer.promise;
};

UserSchema.pre('save', function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }

      // override the cleartext password with the hashed one
      user.password = hash;
      user.salt = salt;
      next();
    });
  });
});

module.exports = mongoose.model('users', UserSchema);
var expect = require('chai').expect;

describe('Client Test', function(){
  it('should run a fake test', function(){
    expect(3).to.equal(3);
  });
});
var expect = require('chai').expect;
var request = require('request');
var jwt = require('jwt-simple');
// Require server.js so we have access to the mongoose connection
var dbConnection = require('../../server/server');
var User = require('../../server/users/user-model');

describe('Server Tests', function(){

  beforeEach(function(){

    // Delete test users
    User.findOneAndRemove({username: 'nicktest'}, function(err, obj) {
      if (err) {
        throw err;
      }
    });
  });

  it('Signup should save a new user to the database', function(done){
    var options = {
      'method': 'POST',
      'uri': 'http://localhost:8080/users/signup',
      'json': {
        'username': 'nicktest',
        'password': 'nickpass'
      }
    };

    request(options, function(error, res, body){
      if (error) {
        throw error;
      } else {
        User.findOne({username: 'nicktest'}, function(err, obj){
          if (err) {
            throw err;
          } else if (body && body.token) {
            var user = jwt.decode(body.token, 'secret').username;
            expect(user).to.equal('nicktest');
            done();
          }
        });
      }
    });

  });

  xit('should sign in an existing user', function(done){
    
    done();
  });

  xit('should logout a user that is signed in', function(done){
    
    done();
  });
});

// Handles the errors on the server
module.exports = {
  errorLogger: function (error, req, res, next) {
    console.error(error.stack);
    next(error);
  },
  errorHandler: function (error, req, res, next) {
    // Send error message to client
    res.send(500, {error: error.message});
  }
};
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Request handlers
// user authentication routes
var user = require('./users/user-controller.js');
// Data query routes
// var data = require('./data/data-controllers.js');
var errors = require('./error-handlers.js');

var app = express();

// Python server connection
// var python = require('./python/pythonComm.js');

// Sends some data to Python, Python squares it - this is simply part
// of testing the python connection and can be removed later
// python.invoke("processData", [1,2,3], function(error, res, more) {
  // if(error){
    // throw error;
//   } 
//   console.log(res);
// }); 


// MongoDB connection
var mongoUrl = process.env.PORT ? "mongodb://webEKGAPI:yhXk8EPXDSfy@ds051160.mongolab.com:51160/ekgapi" : 'mongodb://localhost/ekgtracker';

mongoose.connect(mongoUrl);

app.use(express.static(__dirname + '/../client'));

// For every incoming request, the following will parse the 
// body of the request for its contents before passing them
// off to the other request handlers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// User-authentication routes, handles signin, signup, and checkAuth
app.post('/users/signin', user.signin);
app.post('/users/signup', user.signup);
app.get('/users/signedin', user.checkAuth);

// If incoming request is not pinging a user authentication route
// then we make sure they are signed in by getting the token from
// the header
app.use(user.decode);

// These routes are for data queries
// app.get('/users/data', data.getData);

// If there are errors from the server, use these to send back the errors
app.use(errors.errorLogger);
app.use(errors.errorHandler);

app.listen(process.env.PORT || '8080');
console.log("Server is listening...");

module.exports = app;

;(function(){
  'use strict';

  angular.module('ekg', [
    'ekg.auth',
    'ekg.home',
    'ui.router'
  ])

  .run(function($rootScope, $state, Auth){

    $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams){
      if (toState.authenticate && !Auth.isAuth()){
        // User isn’t authenticated but the state requires authentication
        $state.transitionTo('signin');
        event.preventDefault(); 
      }
    });

  })

  .config(function($stateProvider, $urlRouterProvider, $httpProvider){

    // AngularUI Router uses the concept of states
    // Documentation: https://github.com/angular-ui/ui-router
    $stateProvider

      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainController',
        authenticate: true
      })

      .state('signin', {
        url: '/signin',
        templateUrl: '/auth/signin.html',
        controller: 'AuthController'
      })

      .state('signup', {
        url: '/signup',
        templateUrl: '/auth/signup.html',
        controller: 'AuthController'
      });

    // The default route should point to the home page
    // which contains the graphs
    $urlRouterProvider.otherwise('/home');

    //We add $httpInterceptor into the array
    $httpProvider.interceptors.push('AttachTokens');

  })

  .factory('AttachTokens', function ($window) {
    // This is an $httpInterceptor. Its job is to stop all out going requests
    // then look in local storage and find the user's token.
    // Then, add it to the header so the server can validate the request
    var attach = {
      request: function (object) {
        var jwt = $window.localStorage.getItem('com.ekgtracker');
        if (jwt) {
          object.headers['x-access-token'] = jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        return object;
      }
    };
    return attach;
  });
})();

angular.module('ekg.auth', [])

.controller('AuthController', function ($scope, $window, $state, Auth) {

  $scope.user = {};

  $scope.signin = function () {
    Auth.signin($scope.user)
      .then(function (token) {
        if (token) {
          $window.localStorage.setItem('com.ekgtracker', token);
          $state.transitionTo('home');
        } else {
          $state.transitionTo('signin');
          alert('Username or password was incorrect. Please try again.');
        }
      })
      .catch(function (error) {
        alert('Error in signin function: ', error);
      });
  };

  $scope.signup = function (isValid) {
    if (isValid){
      Auth.signup($scope.user)
        .then(function (token) {
          if (token) {
            $window.localStorage.setItem('com.ekgtracker', token);
            $state.transitionTo('home');
          } else {
            $state.transitionTo('signup');
            alert('Username is already taken. Please select different username.');
          }
        })
        .catch(function (error) {
          alert('Error in signup function: ', error);
        });
    } else {
      alert('Username must be between 4 and 140 characters long and password must be between 8 and 140 characters long.');
    }
  };

  $scope.signout = Auth.signout;

})

.factory('Auth', function ($http, $state, $window) {
 
   var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/users/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/users/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.ekgtracker');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.ekgtracker');
    $state.transitionTo('signin');
  };

  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };

});
angular.module('ekg.home', [
  'ekg.auth'
])

.controller('MainController', function ($scope, DataGetter, Auth) {

  DataGetter.getData(true)
    .success(function(result){
      $scope.sampleData1 = result;
      $scope.renderer = 'line';
    })
    .catch(function(error){
      console.log('http get error', error);
    });

  DataGetter.getData()
    .success(function(result){
      $scope.sampleData2 = result;
      $scope.renderer = 'line';
    })
    .catch(function(error){
      console.log('http get error', error);
    });

  $scope.getData = function(dayOfWeek, hour, min) {
    DataGetter.getData(false, dayOfweek, hour, min)
      .success(function(result){
        $scope.sampleData1 = result;
        $scope.renderer = 'line';
      })
      .catch(function(error){
        console.log('http get error', error);
      });
  };

  $scope.signout = Auth.signout;
  
})

  // Retrieves ekg data from node server
.factory('DataGetter', function ($http) {

  return {
    getData: function(large, dayOfWeek, hour, min) {
      if (large) {
        return $http.get('/../sampleData/sample1snippet.json');
      } else {
        return $http.get('/../sampleData/sample1.json');
      }
    }
  };

});

angular.module('ekg')
.directive('rickshawChart', function () {
  return {
    scope: {
      data: '=',
      renderer: '='
    },
    template: '<div></div>',
    restrict: 'E',
    link: function postLink(scope, element, attrs) {
      scope.$watchCollection('[data, renderer]', function(newVal, oldVal){
        
        if(!newVal[0]){
          return;
        }

        element[0].innerHTML ='';

        var graph = new Rickshaw.Graph({
          element: element[0],
          width: attrs.width,
          height: attrs.height,
          series: [{data: scope.data, color: attrs.color}],
          renderer: scope.renderer
        });

        graph.render();
      });
    }
  };
});

module.exports = {

  getData: function(req, res, next){

    // the time property in the request body should be an object 
    // that contains three properties: day of week (a number
    // between 1 and 7 with 1 = Monday, 7 = Sunday), hour (a number
    // between 0 and 23), and minute (a number between 0 and 59) 
    var startTime = req.body.time;

    // the username was put onto the request by the decode middleware
    var username = req.username;

    // query database for the data for data from that user
    // INSERT CODE TO PING SQL DATABASE HERE


  }
  
};
var zerorpc = require("zerorpc");

var client = new zerorpc.Client();
client.connect("tcp://ekg-python12.cloudapp.net:4242");

// checks whether connection to Python is present
client.invoke("hello", "Node!", function(error, res, more) {
    if(error){
      throw error;
    }
    console.log("Response from Python:", res);
});

module.exports = client;
var User = require('./user-model.js'),
    Q    = require('q'),
    jwt  = require('jwt-simple');

module.exports = {

  // sign-in function
  signin: function (req, res, next) {
    var username = req.body.username,
        password = req.body.password;

    var findUser = Q.nbind(User.findOne, User);
    findUser({username: username})
      .then(function (user) {
        if (!user) {
          // generates an error if user is not found in the system
          next(new Error('User does not exist'));
        } else {
          return user.comparePasswords(password)
            .then(function(foundUser) {
              if (foundUser) {
                var token = jwt.encode(user, 'secret');
                // responds with a token when the user is found in the system
                res.json({token: token});
              } else {
                return next(new Error('No user'));
              }
            });
        }
      })
      .fail(function (error) {
        next(error);
      });
  }, //end signin

  // sign-up function
  signup: function (req, res, next) {
    var username  = req.body.username,
        password  = req.body.password,
        create,
        newUser;

    var findOne = Q.nbind(User.findOne, User);

    // check to see if user already exists
    findOne({username: username})
      .then(function(user) {
        if (user) {
          // errors when when the user does already exist
          next(new Error('User already exist!'));
        } else {
          // make a new user if one doesn't exist
          create = Q.nbind(User.create, User);
          newUser = {
            username: username,
            password: password
          };
          return create(newUser);
        }
      })
      .then(function (user) {
        // create token to send back for auth using jwt
        var token = jwt.encode(user, 'secret');
        res.json({token: token});
      })
      .fail(function (error) {
        next(error);
      });
  }, //end signup

  // checking to see if the user is authenticated
  // grab the token in the header is any
  // then decode the token, which we end up being the user object
  // check to see if that user exists in the database
  checkAuth: function (req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) {
      next(new Error('No token'));
    } else {
      var user = jwt.decode(token, 'secret');
      var findUser = Q.nbind(User.findOne, User);
      findUser({username: user.username})
        .then(function (foundUser) {
          if (foundUser) {
            res.send(200);
          } else {
            res.send(401);
          }
        })
        .fail(function (error) {
          next(error);
        });
    }
  }, //end checkAuth

  // this is the middleware function that will decode
  // the username that identifies the user from which
  // the incoming request is coming
  decode: function (req, res, next) {
    
    var token = req.headers['x-access-token'];
    var user;
    if (!token) {
      // send forbidden if a token is not provided
      return res.send(403); 
    }
    try {
      // decode token and attach user to the request
      // for use inside our controllers
      user = jwt.decode(token, 'secret');
      req.username = user.username;
      next();
    } catch(error) {
      return next(error);
    }

  }//end decode

};
var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt-nodejs'),
    Q        = require('q'),
    SALT_WORK_FACTOR  = 10;

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  salt: String
});

UserSchema.methods.comparePasswords = function (candidatePassword) {
  var defer = Q.defer();
  var savedPassword = this.password;
  bcrypt.compare(candidatePassword, savedPassword, function (err, isMatch) {
    if (err) {
      defer.reject(err);
    } else {
      defer.resolve(isMatch);
    }
  });
  return defer.promise;
};

UserSchema.pre('save', function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }

      // override the cleartext password with the hashed one
      user.password = hash;
      user.salt = salt;
      next();
    });
  });
});

module.exports = mongoose.model('users', UserSchema);
var expect = require('chai').expect;

describe('Client Test', function(){
  it('should run a fake test', function(){
    expect(3).to.equal(3);
  });
});
var expect = require('chai').expect;
var request = require('request');
var jwt = require('jwt-simple');
// Require server.js so we have access to the mongoose connection
var dbConnection = require('../../server/server');
var User = require('../../server/users/user-model');

describe('Server Tests', function(){

  beforeEach(function(){

    // Delete test users
    User.findOneAndRemove({username: 'nicktest'}, function(err, obj) {
      if (err) {
        throw err;
      }
    });
  });

  it('Signup should save a new user to the database', function(done){
    var options = {
      'method': 'POST',
      'uri': 'http://localhost:8080/users/signup',
      'json': {
        'username': 'nicktest',
        'password': 'nickpass'
      }
    };

    request(options, function(error, res, body){
      if (error) {
        throw error;
      } else {
        User.findOne({username: 'nicktest'}, function(err, obj){
          if (err) {
            throw err;
          } else if (body && body.token) {
            var user = jwt.decode(body.token, 'secret').username;
            expect(user).to.equal('nicktest');
            done();
          }
        });
      }
    });

  });

  xit('should sign in an existing user', function(done){
    
    done();
  });

  xit('should logout a user that is signed in', function(done){
    
    done();
  });
});
