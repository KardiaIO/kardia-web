var gulp = require('gulp');
var jshint = require('gulp-jshint');
var map = require('map-stream');

var exitOnJshintError = map(function (file, cb) {
  if (!file.jshint.success) {
    console.error('jshint failed');
    process.exit(1);
  }
});

gulp.task('lint', function(){
  return gulp.src('client/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'))
      .pipe(exitOnJshintError);
});

gulp.task('watch', function(){
  gulp.watch('client/*.js', ['lint']);
});

gulp.task('default', ['lint', 'watch']);
gulp.task('travis', ['lint']);
