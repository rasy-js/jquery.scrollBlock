'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const autoprefixer = require('gulp-autoprefixer');
const changed = require('gulp-changed');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const concatCss = require('gulp-concat-css');
const csscomb = require('gulp-csscomb');
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const pug = require('gulp-pug');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const rename = require("gulp-rename");
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const watch = require('gulp-watch');
const mainBowerFiles = require('main-bower-files');
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');
const zip = require('gulp-zip');
const glob = require('glob');

/* Main bower files */

gulp.task('main-files', ['main-js', 'main-css']);

gulp.task('main-css', function() {
  return gulp.src(mainBowerFiles('**/*.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(notify('Zrobleno! Task main-css!'));
});

gulp.task('main-js', function() {
  return gulp.src(mainBowerFiles('**/*.js'))
   .pipe(gulp.dest('dist/js'))
   .pipe(notify('Zrobleno! Task main-js!'));
});


/* Build css and js */
gulp.task('css', function() {
  var allstyles = true;
  var path = [['dist/css/*.css'], ['dist/css/*.css', '!dist/css/style.css']];
  var include_styles = allstyles ? path[0] : path[1];

  return gulp.src(include_styles)
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
     }))
    .pipe(csscomb())
    .pipe(gulp.dest('dist/css'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename('jquery.scrollBlock.min.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(notify('Zrobleno! Task css!'));
});

gulp.task('css-watch', ['css'], function (done) {
    //browserSync.reload();
    done();
});


gulp.task('js', function() {
  return gulp.src(['dist/js/*.js', '!dist/js/jquery.js', '!dist/js/mdlComponentHandler.js'])
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    //.pipe(concat('vendor.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(uglify())
    .pipe(rename('jquery.scrollBlock.min.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(notify('Zrobleno! Task js!'));
});

gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});


/* Minify images */

gulp.task('imgmin', function () {
  gulp.src('img_pre/*')
    .pipe(changed('img'))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [imageminPngquant()]
    }))
    .pipe(gulp.dest('img'))
    .pipe(notify('Zrobleno! Task imgmin!'));
});

gulp.task('imgmin-watch', ['imgmin'], function (done) {
    browserSync.reload();
    done();
});


gulp.task('imgclean', function() {
  return gulp.src('img', {read: false})
    .pipe(clean())
    .pipe(notify('Zrobleno! Task imgclean!'));
});


/* Pug template */

gulp.task('pug', function buildHTML() {
  return gulp.src('*.pug')
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(plumber({errorHandler: function(err) {console.log("Error: " + err)}}))
  //.pipe(changed('.', {extension: '.html'}))
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest('.'))
  .pipe(notify('Zrobleno! Task pug!'))
});

gulp.task('pug-watch', ['pug'], function (done) {
    browserSync.reload();
    done();
});

/* Serve */

gulp.task('default', ['serve']);

gulp.task('serve', ['sass'], function() {

    browserSync.init({
      server: {
        baseDir: "./"
      }
    });

    gulp.watch("scss/**/*.scss", ['sass']);
    gulp.watch("dist/js/*.js", ['js-watch']);
    gulp.watch("dist/css/*.css", ['css-watch']);
    //gulp.watch(['blocks/**/*.pug', '*.pug',  'templates/**/*.pug'], ['pug-watch']);
    gulp.watch('img_pre/*', ['imgmin-watch']);
    gulp.watch("demo/**.*").on('change', browserSync.reload);
    gulp.watch(['*.*']).on('change', browserSync.reload);
});


/* Sass */

gulp.task('sass', function () {
  return gulp.src('scss/**/*.scss')
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(sass({
       outputStyle: 'expanded',
     }).on('error', sass.logError))
    .pipe(gulp.dest('dist/css'))
    .pipe(notify('Zrobleno! Task sass!'))
    .pipe(browserSync.stream());
});


/* Archive */

gulp.task('zip', function () {
  return gulp.src([
    '**'
  ], {base: '.'})
    .pipe(zip('bak.zip'))
    .pipe(gulp.dest('.'))
    .pipe(notify('Zrobleno! Task zip!'));
});

