var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mochaTest = require('gulp-mocha');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var server = require('gulp-express');
var gutil = require('gulp-util');

// Command line option:
//  --fatal=[warning|error|off]
var fatalLevel = require('yargs').argv.fatal;

var ERROR_LEVELS = ['error', 'warning'];

// Return true if the given level is equal to or more severe than
// the configured fatality error level.
// If the fatalLevel is 'off', then this will always return false.
// Defaults the fatalLevel to 'error'.
function isFatal(level) {
   return ERROR_LEVELS.indexOf(level) <= ERROR_LEVELS.indexOf(fatalLevel || 'error');
}

// Handle an error based on its severity level.
// Log all levels, and exit the process for fatal levels.
function handleError(level, error) {
   gutil.log(error.message);
   if (isFatal(level)) {
      process.exit(1);
   }
}

// Convenience handler for error-level errors.
function onError(error) { handleError.call(this, 'error', error);}
// Convenience handler for warning-level errors.
function onWarning(error) { handleError.call(this, 'warning', error);}

// Task that emits an error that's treated as a warning.
gulp.task('warning', function() {
   return gulp.src([
      'client/**/*.js',
      'server/**/*.js',
      'gulpfile.js',
      '!client/lib/**',
      '!client/components/triage/highcharts/highcharts.js'
    ])
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'))
      .on('error', onWarning);
});

// Task that emits an error that's treated as an error.
gulp.task('error', function() {
   return gulp.src([
      'client/**/*.js',
      'server/**/*.js',
      'gulpfile.js',
      '!client/lib/**',
      '!client/components/triage/highcharts/highcharts.js'
    ])
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'))
      .on('error', onError);
});

gulp.task('server', function () {
    // Start the server at the beginning of the task
    require('./server.js');
    //TODO: Restart the server when file changes - add a line for all files.
    //gulp.watch(['server/**/*.html'], server.notify);
});

gulp.task('lint', function(){
  return gulp.src([
    'client/**/*.js',
    'server/**/*.js',
    'gulpfile.js',
    '!client/lib/**',
    '!client/components/triage/highcharts/highcharts.js'
    ])
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'))
      .on('error', onError);
});


gulp.task('mochaTest', function(){
  return gulp.src([
    'tests/clientSpecs/clientSpecs.js',
    // server specs dont run with mongo in travis at the moment
    'tests/serverSpecs/serverSpecs.js'
    ])
      .pipe(mochaTest());
});

gulp.task('clean', function(){
  return gulp.src('dist/newConcat.js', {read: false})
    .pipe(clean());
});

gulp.task('concat', function() {
  return gulp.src(['**/*.js', '!client/lib/**', '!node_modules/**', '!gulpfile.js', '!client/design/**'])
    .pipe(concat({ path: 'newConcat.js'}))
    .pipe(gulp.dest('./dist'));
});

// Not currently watching any files
gulp.task('watch', function(){
  gulp.watch(['client/**/*.js', 'server/**/*.js'], ['lint']);
});

// Run 'gulp' to lint and test your code
gulp.task('default', [
  'lint',
  'mochaTest'
  // 'server'
]);

// Run 'gulp build' to check your code and create a new concatenated file
gulp.task('build', [
  'lint',
  'mochaTest',
  'clean',
  'concat'
]);

// Task for travis
gulp.task('travis', [
  'lint'
  // 'mochaTest'
]);

