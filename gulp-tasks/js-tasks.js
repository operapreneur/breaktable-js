// Compile SASS, autoprefix css, & sourcemap
// Watch JS

// uses: browser-tasks.js

'use strict';

// packages
const gulp          = require('gulp');
const babel         = require("gulp-babel");

const sourcemaps    = require('gulp-sourcemaps');
const gulpif        = require('gulp-if');
const concat        = require('gulp-concat');
const newer         = require('gulp-newer');

// task vars
const srcJS         = '_src/js_src/**/*.js';
const appJS         = '_src/_app/js';
const jsAssets      = '_src/_app/js/**/*.json';

//////////////////////////////////////////////////////////////////

gulp.task("compile_js", function () {
  return gulp.src(srcJS)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat("bundle.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(appJS));
});

gulp.task('watch_js', function() {
  return gulp.watch(srcJS, gulp.series('compile_js', 'browser_reload'));
});

gulp.task('watch_jsAssets', function() {
  return gulp.watch(jsAssets, gulp.series('browser_reload'));
});
