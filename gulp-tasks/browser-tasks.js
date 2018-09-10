// Start browserSync server
// Reload browserSync server

'use strict';

// packages
const gulp          = require('gulp');
const browserSync   = require('browser-sync').create();

// task vars
const app_dir     = '_src/_app/';

const watchAssets = [
  app_dir + '**'
];

//////////////////////////////////////////////////////////////////

gulp.task('browser_serve', function(done) {
  browserSync.init({
    server: app_dir,
    ghostMode: {
      clicks: true,
      forms: true,
      scroll: false
    }
  });
  done();
});

gulp.task('browser_reload', function(done) {
  browserSync.reload();
  done();
});

// watch assets
gulp.task('watch_assets', function() {
  return gulp.watch(watchAssets, gulp.series('browser_reload'));
});
