const 
  gulp = require('gulp-npm-run')(require('gulp')),
  browserSync = require('browser-sync'),
  runSequence = require('run-sequence'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  stringify = require('stringify');

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
    runSequence('rebuild', function() {
      browserSync.reload()
    })
  })
})

gulp.task('rebuild', () => {
  return browserify({
            entries: './src/register.js'
          })
          .transform(stringify, {
            appliesTo: { includeExtensions: ['.html'] }
          })
          .bundle()
          .pipe(source('ng-time-input.js'))
          .pipe(gulp.dest('.'));
});

