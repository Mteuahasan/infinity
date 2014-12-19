var gulp       = require('gulp');
var browserify = require('gulp-browserify');
var uglify     = require('gulp-uglify');
var livereload = require('gulp-livereload');
var sass       = require('gulp-sass');
var minifyCSS  = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

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
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./build/css'))
    .pipe(livereload());
});

// JS Files - Development
gulp.task('js', function() {
  gulp.src('src/js/app.js')
    .pipe(browserify({
      //transform: ['workerify'],
      insertGlobals : true,
      debug : true
    }))
    .pipe(gulp.dest('./build/js'))
    .pipe(livereload());
});

/** PROD */

// SCSS Files
gulp.task('sass-prod', function () {
  gulp.src('./src/sass/main.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(gulp.dest('./build/css'))
});

// JS Files - Development
gulp.task('js-prod', function() {
  gulp.src('src/js/app.js')
    .pipe(browserify({
      insertGlobals : true,
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'))
});


/**
  * DEFAULT TASK
*/
gulp.task('default', ['js', 'sass', 'watch']);
gulp.task('prod', ['js-prod', 'sass-prod']);
