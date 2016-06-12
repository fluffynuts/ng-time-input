const 
  gulp = require('gulp-npm-run')(require('gulp')),
  browserSync = require('browser-sync'),
  runSequence = require('run-sequence')

gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: '.'
    }
  })
  const watcher = gulp.watch(['index.html', 'src/**/*.js', 'src/**/*.css', 'src/**/*.html']);
  console.log('watching...');
  watcher.on('change', ev => {
    console.log(ev.type + ': ' + ev.path)
    runSequence('build', 'force-reload')
  })
})

gulp.task('force-reload', done => {
  setTimeout(() => {
    // lazy hack: gulp-npm-run doesn't appear to be waiting
    //  for build to complete
    browserSync.reload();
    done();
  }, 1000);
})
