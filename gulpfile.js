
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var runElectron = require('gulp-run-electron');

gulp.task('sass', function () {
  return gulp.src('app/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
          outputStyle: 'compressed'
        })).on('error', gutil.log)
        .pipe(autoprefixer()).on('error', gutil.log)
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('app/css')).on('error', gutil.log);
});

gulp.task('electron', ['sass'], function () {
  gulp.src("app")
    .pipe(runElectron(["--enable-logging"], {cwd: "./"}));
});

gulp.task('default', ['sass', 'electron'], function () {
  gulp.watch('app/sass/**/*.scss', ['sass']);
  gulp.watch('app/**/*', ['electron']);
});
