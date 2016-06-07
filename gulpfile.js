'use strict';

var gulp = require('gulp');
var pkg = require('./package.json');
var $ = require('gulp-load-plugins')();
var del = require('del');
var head = '/*!\n' +
           ' * Retina.js v<%= pkg.version %>\n' +
           ' *\n' +
           ' * Copyright 2016 Axial, LLC\n' +
           ' * Released under the MIT license\n' +
           ' *\n' +
           ' * Retina.js is an open source script that makes it easy to serve\n' +
           ' * high-resolution images to devices with retina displays.\n' +
           ' */\n';

var entry = './src/retina.js';

gulp.task('clean', cleanTask);
gulp.task('copy', copyTask);
gulp.task('build', ['clean', 'lint'], buildTask);
gulp.task('lint', lintTask);

function copyTask() {
  return gulp.src(entry)
    .pipe($.banner(head, { pkg: pkg }))
    .pipe(gulp.dest('./dist'));
}

function cleanTask() {
  return del(['dist']);
}

function buildTask() {
  return gulp.src(entry)
    .pipe($.banner(head, { pkg: pkg }))
    .pipe($.babel())
    .pipe(gulp.dest('./dist/'))
    .pipe($.size())
    .pipe($.uglify({preserveComments: 'license'}))
    .pipe($.rename('retina.min.js'))
    .pipe($.size())
    .pipe(gulp.dest('./dist/'));
}

function lintTask() {
  return gulp.src(entry)
    .pipe($.eslint())
    .pipe($.eslint.format());
}
