var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mochaTest = require('gulp-mocha');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var server = require('gulp-express');

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
      .pipe(jshint.reporter('fail'));
});


gulp.task('mochaTest', function(){
  return gulp.src([
    'tests/clientSpecs/clientSpecs.js'
    // server specs dont run with mongo in travis at the moment
    // 'tests/serverSpecs/serverSpecs.js'
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
  // 'lint'
  'mochaTest'
]);

