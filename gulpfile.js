// @operapreneur Master gulp file
// v0.1.0

/////////////////////////////////////
// !! Gulp 4.0.0 !!
/////////////////////////////////////

'use strict';

const gulp          = require('gulp');
const requireDir    = require('require-dir');

//////////////////////////////////////////////////////////////////
// globals

const onError = function (error) {
  console.error.bind(error);
  this.emit('end');
}


//////////////////////////////////////////////////////////////////
// import tasks

requireDir('./gulp-tasks');

//////////////////////////////////////////////////////////////////
// default

gulp.task('default',
  gulp.series('compile_sass', 'compile_js', 'browser_serve',
    gulp.parallel('watch_sass', 'watch_js', 'watch_jsAssets', 'watch_assets')
  )
);
