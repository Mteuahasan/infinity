var gulp       = require('gulp');
var browserify = require('gulp-browserify');
var livereload = require('gulp-livereload');

gulp.task('watch', function() {
  gulp.watch(__dirname+'/src/js/**/*.js', ['js']);
});

// JS Files - Development
gulp.task('js', function() {
  gulp.src('src/js/app.js')
    .pipe(browserify({
      insertGlobals : true,
      debug : true
    }))
    .pipe(gulp.dest('./build/js'))
    .pipe(livereload());
});


/**
  * DEFAULT TASK
*/
gulp.task('default', ['js', 'watch']);
