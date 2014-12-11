var gulp       = require('gulp');
var browserify = require('gulp-browserify');
var livereload = require('gulp-livereload');
var sass       = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('watch', function() {
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/sass/**/*.scss', ['sass']);
});


// SCSS Files
gulp.task('sass', function () {
  gulp.src('./src/sass/main.scss')
    .pipe(sourcemaps.init())
      .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/css'))
    .pipe(livereload());
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
gulp.task('default', ['js', 'sass', 'watch']);
