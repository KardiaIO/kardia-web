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
      .pipe(mochaTest())
      .once('end', function(){
        process.exit();
      });
});

gulp.task('concat', function() {
  gulp.src(['**/*.js', '!client/lib/**', '!node_modules/**', '!gulpfile.js'])
    .pipe(concat({ path: 'newConcat.js'}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function(){
  gulp.watch(['client/**/*.js', 'server/**/*.js'], ['lint']);
});

gulp.task('default', ['lint', 'mochaTest', 'concat', 'watch']);
gulp.task('travis', ['lint', 'mochaTest']);
