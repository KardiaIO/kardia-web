var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var nodemon = require('gulp-nodemon');

var mocha = require('gulp-spawn-mocha');
var karma = require('karma').server;

/**
 * House Keeping
 */

gulp.task('lint', function(){
  return gulp.src([
    'client/**/*.js',
    'server/**/*.js',
    'gulpfile.js',
    '!client/lib/**'
    ])
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'));
});

gulp.task('clean', function(){
  return gulp.src('./dist/*', { read: false })
    .pipe(clean());
});

/**
 * Environments
 */

gulp.task('develop', function () {
  nodemon({ 
    script: 'server.js', 
    env: { 'NODE_ENV': 'development' } 
  })
    .on('change', ['lint'])
    .on('restart', function () {
      console.log('Server Restarted!');
    });
});

/**
 * Tests
 */

gulp.task('mocha', function(){
  return gulp.src('server/test/server.pythonComm.test.js', { read: false })
    .pipe(mocha({
      env: {'NODE_ENV': 'test'},
      reporter: 'nyan'
    }));
});

// Karma Single Run Task.  Used for Travis CI
gulp.task('karma', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

// Travis CI testing task.  .travis.yml calls this task.
gulp.task('ci', ['lint', 'karma']);

/**
 * Main Tasks
 */

// Catchall Default
gulp.task('default', [
  
]);

// Minification, etc.
gulp.task('build', [
  'lint',
  'clean'
]);
