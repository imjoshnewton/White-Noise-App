
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');

gulp.task('sass', function () {
  return gulp.src('app/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
          outputStyle: 'compressed'
        })).on('error', gutil.log)
        .pipe(autoprefixer()).on('error', gutil.log)
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('app/css')).on('error', gutil.log)
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
  return gulp.src('app/img/**/*.+(png|jpg|gif|svg)')
  .pipe(imagemin())
  .pipe(gulp.dest('build/img'))
})

gulp.task('default', ['sass'], function () {
  gulp.watch('app/sass/**/*.scss', ['sass'])
})
