'use strict';

var del = require('del');
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var gulpIf = require('gulp-if');
var changed = require('gulp-changed');
var debug = require('gulp-debug');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var patch = {
  src: {
    root: 'source/',
    html: 'source/*.html',
    css: 'source/css/*.css',
    fonts: 'source/fonts/*',
    favicon: 'source/favicon.ico',
    img: 'source/img/*',
    photos: 'source/photos/*',
    js: 'source/js/*.js'
  },
  dest: {
    root: 'build/',
    html: 'build/',
    css: 'build/css/',
    fonts: 'build/fonts/',
    img: 'build/img/',
    js: 'build/js/'
  }
};

// флаг, устанавливающий разработка это или сборка для продакшина
var isDev = !process.env.NODE_ENV || (process.env.NODE_ENV === 'development');

gulp.task('html:copy', function () {
  console.log('---------- Копирование HTML');
  return gulp.src(patch.src.html)
    .pipe(changed(patch.dest.html))
    .pipe(gulp.dest(patch.dest.html))
    .pipe(browserSync.stream({stream: true}));
});

gulp.task('css:copy', function () {
  console.log('---------- Копирование CSS');
  return gulp.src(patch.src.css)
    .pipe(changed(patch.dest.css))
    .pipe(gulp.dest(patch.dest.css))
    .pipe(browserSync.stream());
});

gulp.task('fonts:copy', function () {
  console.log('---------- Копирование FONTS');
  return gulp.src(patch.src.fonts)
    .pipe(gulp.dest(patch.dest.fonts));
});

gulp.task('favicon:copy', function () {
  console.log('---------- Копирование FONTS');
  return gulp.src(patch.src.favicon)
    .pipe(gulp.dest(patch.dest.root));
});

gulp.task('img:copy', function () {
  console.log('---------- Копирование IMG');
  return gulp.src([patch.src.photos, patch.src.img], {base: patch.src.root})
    .pipe(changed(patch.dest.root))
    .pipe(debug({'title': ' image'}))
    .pipe(gulp.dest(patch.dest.root))
    .pipe(browserSync.stream({stream: true}));
});

gulp.task('js', function () {
  console.log('---------- Компиляция JS');
  return gulp.src(patch.src.js)
    .pipe(plumber({
      errorHandler: function (err) {
        notify.onError({
          title: 'Javascript compilation error',
          message: err.message
        })(err);
        this.emit('end');
      }
    }))
    .pipe(gulpIf(isDev, sourcemaps.init()))
    //.pipe(concat('script.min.js'))
    .pipe(gulpIf(!isDev, uglify()))
    .pipe(gulpIf(isDev, sourcemaps.write('/')))
    .pipe(gulp.dest(patch.dest.js))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('clean', function (done) {
  console.log('---------- Очистка рабочей директории');
  del.sync(patch.dest.root + '*');
  done();
});

gulp.task('serve', function () {
  browserSync.init({
    server: patch.dest.root,
    open: false,
    port: 8080,
    ui: false
  });
});

gulp.task('build',
    gulp.series('clean', 'html:copy',
        gulp.parallel('css:copy', 'fonts:copy', 'favicon:copy', 'img:copy', 'js'))
);

gulp.task('watch', function () {

  gulp.watch(patch.src.html, gulp.series('html:copy'));
  gulp.watch(patch.src.css, gulp.series('css:copy'));
  gulp.watch(patch.src.img, gulp.series('img:copy'));
  gulp.watch(patch.src.photos, gulp.series('img:copy'));

  gulp.watch(patch.src.js, gulp.series('js'));

});

gulp.task('default', gulp.series('build', gulp.parallel('watch', 'serve')));
