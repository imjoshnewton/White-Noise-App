//require('es6-promise').polyfill();

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function () {
  return gulp.src('source/css/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
          outputStyle: 'compressed'
        })).on('error', gutil.log)
        .pipe(autoprefixer()).on('error', gutil.log)
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/css')).on('error', gutil.log)
        .pipe(browserSync.reload({
          stream: true
        }))
})

gulp.task('useref', function () {
  return gulp.src('source/*.html')
    .pipe(useref())
    .pipe(sourcemaps.init())
    .pipe(gulpIf('*.js', uglify())).on('error', gutil.log)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: 'build'
    }
  })
})

gulp.task('default', ['sass', 'useref', 'browserSync'], function () {
  gulp.watch('source/css/**/*.scss', ['sass'])
  gulp.watch('source/*.html', ['useref'])
  gulp.watch('source/js/**/*.js', ['useref'])
})
