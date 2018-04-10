'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();


gulp.task('scripts-reload', function() {
  return buildScripts()
    .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
  return buildScripts();
});


//path.join(conf.paths.src, '/sass/**/_*.scss'),
//    '!' + path.join(conf.paths.src, '/sass/theme/conf/**/*.scss'),


function buildScripts() {
    return gulp.src(path.join(conf.paths.src, '/app/**/*.*'))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.size())
};
