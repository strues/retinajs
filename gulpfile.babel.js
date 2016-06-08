'use strict';

import gulp from 'gulp';
import pkg from './package.json';
import load from 'gulp-load-plugins';
import del from 'del';
import runSequence from 'run-sequence';

const $ = load();
const head = '/*!\n' +
           ' * Retina.js v<%= pkg.version %>\n' +
           ' *\n' +
           ' * Copyright 2016 Axial, LLC\n' +
           ' * Released under the MIT license\n' +
           ' *\n' +
           ' * Retina.js is an open source script that makes it easy to serve\n' +
           ' * high-resolution images to devices with retina displays.\n' +
           ' */\n';

const entry = './src/retina.js';

gulp.task('clean', cleanTask);
gulp.task('copy', copyTask);
gulp.task('build-browser', browserBuildTask);
gulp.task('build-node', npmBuildTask);
gulp.task('build', ['clean', 'lint'], (cb) => {
  runSequence('build-browser', 'build-node', cb);
});
gulp.task('lint', lintTask);

function copyTask() {
  return gulp.src(entry)
    .pipe($.banner(head, { pkg: pkg }))
    .pipe(gulp.dest('./dist'));
}

function cleanTask() {
  return del(['dist']);
}

function npmBuildTask() {
  return gulp.src(entry)
    .pipe($.preprocess({ context: { NODE: true } }))
    .pipe($.banner(head, { pkg: pkg }))
    .pipe($.babel())
    .pipe(gulp.dest('./dist/'));
}

function browserBuildTask() {
  return gulp.src(entry)
    .pipe($.preprocess({ context: { BROWSER: true } }))
    .pipe($.banner(head, { pkg: pkg }))
    .pipe($.babel())
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
