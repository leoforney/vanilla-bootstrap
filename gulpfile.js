/* laxcomma: true */
'use strict';

var gulp = require('gulp')
  , $    = require('gulp-load-plugins')()

gulp.task('styles', function () {
  var themes = $.filter('!{style,custom}.less');

  return gulp.src([
    'less/style.less'
  , 'less/themes/*.less'
  ])
    .pipe($.plumber())
    .pipe(themes)
    .pipe($.rename(function (path) {
      path.basename = 'custom_' + path.basename;
    }))
    .pipe(themes.restore())
    .pipe($.less())
    .pipe($.autoprefixer())
    .pipe($.csso())
    .pipe(gulp.dest('design'))
    .pipe($.size({showFiles: true}));
});

gulp.task('scripts', function () {
  var dependencies = require('wiredep')()
    , source = $.filter('js/src/**/*.js');

  return gulp.src((dependencies.js || []).concat([
    'js/src/main.js'
  ]))
    .pipe($.plumber())
    .pipe($.concat('custom.js'))
    .pipe($.uglify())
    .pipe(gulp.dest('js'))
    .pipe($.size({showFiles: true}));
});

gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  return gulp.src('less/**/*.less')
    .pipe(wiredep())
    .pipe(gulp.dest('less'));
});

gulp.task('default', ['styles', 'scripts']);

gulp.task('watch',  function () {
  var server = $.livereload();

  gulp.watch([
    'design/*.css'
  , 'js/*.js'
  , 'views/**/*.tpl'
  ], function (file) {
    return server.changed(file.path);
  });

  gulp.watch('less/**/*.less', ['styles']);
  gulp.watch('js/src/**/*.js', ['scripts']);
  gulp.watch('bower.json', ['wiredep']);
});

// Expose Gulp to external tools
module.exports = gulp;
