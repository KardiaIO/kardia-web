var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mochaTest = require('gulp-mocha');
var concat = require('gulp-concat');
var clean = require('gulp-clean');

gulp.task('lint', function(){
  return gulp.src([
    'client/**/*.js',
    'server/**/*.js',
    'gulpfile.js',
    '!client/lib/**',
    '!client/design/**'
    ])
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'));
});

gulp.task('mochaTest', function(){
  return gulp.src(['tests/clientSpecs/clientSpecs.js', 'tests/serverSpecs/serverSpecs.js'])
      .pipe(mochaTest());
});

gulp.task('clean', function(){
  return gulp.src('dist/newConcat.js', {read: false})
    .pipe(clean());
});

gulp.task('concat', function() {
  return gulp.src(['**/*.js', '!client/lib/**', '!node_modules/**', '!gulpfile.js'])
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
  'lint', 
  'mochaTest'
]);
