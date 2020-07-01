const gulp = require('gulp');
const sass = require('gulp-sass');
const compass = require('gulp-compass');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const gulpIf = require('gulp-if');
const del = require('del');
const fileInclude = require('gulp-file-include');
const runSequence = require('run-sequence');
const minifyCss = require("gulp-minify-css");

sass.compiler = require('node-sass');

gulp.task('browser-sync', function() {
  browserSync.init({
      server: {
          baseDir: '.'
      }
  });
});

gulp.task('sass', function () {
    return gulp.src('./src/scss/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('src/css')).pipe(browserSync.reload({
        stream: true
      }));
  });

gulp.task('watch', function () {
  gulp.watch('src/scss/**', ['sass']);
  gulp.watch('src/css/*.css', ['minify-css']);
  gulp.watch('src/pages/*.html', ['sources']);
  gulp.watch('src/pages/**/*.html', ['sources']);
  gulp.watch('*.html').on('change', browserSync.reload);
  gulp.watch('src/js/*.js').on('change', browserSync.reload);
});

gulp.task('minify-css', function () {
  gulp.src('src/css/*.css') // path to your file
  //.pipe(minifyCss())
  .pipe(gulp.dest('src/css'));
});

gulp.task('useref', function () {
    return gulp.src('src/*.html')
    .pipe(useref())
    //.pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'))
    //.pipe(gulp.dest(paths.cssjs));
});

gulp.task('images', function () {
  return gulp.src('src/images/**/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(imagemin({
      interlaced: true
  }))
  .pipe(gulp.dest('dist/images'))
  //.pipe(gulp.dest(paths.images));
});

gulp.task('fonts', function() {
  return gulp.src('src/fonts/*/+(css|fonts)/**')
  .pipe(gulp.dest('dist/fonts'));
});

gulp.task('libs', function() {
  return gulp.src('src/libs/*/+(css|dist|slick|webfonts|scss|less)/**')
  .pipe(gulp.dest('dist/libs'))
  //.pipe(gulp.dest(paths.libs));
});

gulp.task('sources', function() {
  return gulp.src('src/pages/*.html')
  .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file'
  }))
  .pipe(gulp.dest('src'));
});

gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('build', function(callback) {
  runSequence('clean', ['compass', 'sources', 'useref', 'images', 'fonts', 'libs'], callback);
});

gulp.task('default', function() {
  console.log('Thank for using development starter kit. Run "serve" to start development server.');
});

gulp.task('serve', function() {
//    console.log('\x1b[34m%s\x1b[0m', "Server is running at http://localhost:3000");
  runSequence('sources', 'browser-sync', 'sass', 'watch', 'minify-css');
});