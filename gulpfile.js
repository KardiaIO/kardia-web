var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('lint', function(){
    return gulp.src(['client/**/*.js', 'server/**/*.js', 'gulpfile.js', '!client/lib/**'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('watch', function(){
  gulp.watch(['client/**/*.js', 'server/**/*.js', 'gulpfile.js'], ['lint']);
});

gulp.task('default', ['lint', 'watch']);
gulp.task('travis', ['lint']);
