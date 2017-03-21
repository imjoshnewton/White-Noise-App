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
var imagemin = require('gulp-imagemin');

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

gulp.task('audio', ['noise', 'ambiance']);

gulp.task('noise', function () {
  return gulp.src('source/noise/**/*.mp3')
    .pipe(gulp.dest('build/noise'))
})

gulp.task('ambiance', function () {
  return gulp.src('source/ambiance/**/*.mp3')
    .pipe(gulp.dest('build/ambiance'))
})

gulp.task('images', function(){
  return gulp.src('source/img/**/*.+(png|jpg|gif|svg)')
  .pipe(imagemin())
  .pipe(gulp.dest('build/img'))
})

gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: 'build'
    },
    browser: "google chrome"
  })
})

gulp.task('default', ['sass', 'useref', 'audio', 'images', 'browserSync'], function () {
  gulp.watch('source/css/**/*.scss', ['sass'])
  gulp.watch('source/*.html', ['useref'])
  gulp.watch('source/js/**/*.js', ['useref'])
})
