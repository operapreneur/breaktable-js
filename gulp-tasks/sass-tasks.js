// Compile SASS, autoprefix css, & sourcemap
// Watch SASS

// uses: browser-tasks.js

'use strict';

// packages
const gulp          = require('gulp');
const sass          = require('gulp-sass');
const autoprefixer  = require('gulp-autoprefixer');
const sourcemaps    = require('gulp-sourcemaps');

// task vars
const srcSASS       = '_src/scss/**/*.scss';
const appCSS        = '_src/_app/css/';

//////////////////////////////////////////////////////////////////

gulp.task('compile_sass', function (done) {
 return gulp.src(srcSASS)
  .pipe(sourcemaps.init())
  .pipe(sass({
    outputStyle: 'compressed'
  })
  .on('error', sass.logError))
  .pipe(autoprefixer())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(appCSS));
  done();
});

gulp.task('watch_sass', function() {
  return gulp.watch(srcSASS, gulp.series('compile_sass', 'browser_reload'));
});
