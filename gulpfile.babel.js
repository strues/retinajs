'use strict';

import gulp from 'gulp';
import pkg from './package.json';
import load from 'gulp-load-plugins';
import inject from 'gulp-inject-string';
import del from 'del';
import runSequence from 'run-sequence';
import browsersync from 'browser-sync';

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
const scssEntry = './src/_retina.scss';
const sassEntry = './src/_retina.sass';
const lessEntry = './src/retina.less';
const stylEntry = './src/retina.styl';
const server = browsersync.create();


function cleanTask() {
  return del(['dist']);
}

function buildJsTask() {
  return gulp.src(entry)
    // Distribute unminified file
    .pipe($.babel())
    .pipe($.banner(head, { pkg: pkg }))
    .pipe(gulp.dest('./dist/'))

    // Prepare the code for minification and browser distribution
    .pipe(inject.prepend('if (typeof exports === "undefined") { exports = {}; }'))
    .pipe(inject.prepend('(function(){'))
    .pipe(inject.append('}())'))

    // Minify it, distribute it, drop it in the test dir
    .pipe($.uglify({ preserveComments: 'license' }))
    .pipe($.rename('retina.min.js'))
    .pipe($.size())
    .pipe(gulp.dest('./dist/'))
    .pipe(gulp.dest('./test/functional/public/'));
}

function lintTask() {
  return gulp.src(entry)
    .pipe($.eslint())
    .pipe($.eslint.format());
}

function serveTask() {
  return server.init({
    server: './test/functional/public',
    port: 8080
  });
}

function cssDistTask() {
  return gulp.src([sassEntry, scssEntry, lessEntry, stylEntry])
    .pipe(gulp.dest('./dist/'));
}

function scssPrepTask() {
  return gulp.src(scssEntry).pipe(gulp.dest('./test/functional/public/styles/'));
}

function sassPrepTask() {
  return gulp.src(sassEntry).pipe(gulp.dest('./test/functional/public/styles/'));
}

function lessPrepTask() {
  return gulp.src(lessEntry).pipe(gulp.dest('./test/functional/public/styles/'));
}

function stylusPrepTask() {
  return gulp.src(stylEntry).pipe(gulp.dest('./test/functional/public/styles/'));
}

function scssCompileTask() {
  return gulp.src('./test/functional/public/styles/scss-base.scss')
       .pipe($.sass().on('error', $.sass.logError))
       .pipe($.rename('retina.scss.css'))
       .pipe(gulp.dest('./test/functional/public/styles/'));
}

function sassCompileTask() {
  return gulp.src('./test/functional/public/styles/sass-base.sass')
       .pipe($.sass().on('error', $.sass.logError))
       .pipe($.rename('retina.sass.css'))
       .pipe(gulp.dest('./test/functional/public/styles/'));
}

function lessCompileTask() {
  return gulp.src('./test/functional/public/styles/less-base.less')
       .pipe($.less())
       .pipe($.rename('retina.less.css'))
       .pipe(gulp.dest('./test/functional/public/styles/'));
}

function stylusCompileTask() {
  return gulp.src('./test/functional/public/styles/styl-base.styl')
       .pipe($.stylus())
       .pipe($.rename('retina.styl.css'))
       .pipe(gulp.dest('./test/functional/public/styles/'));
}

function cssBuildTask() {
  return runSequence(
    ['prep-scss', 'prep-sass', 'prep-less', 'prep-stylus'],
    ['compile-scss', 'compile-sass', 'compile-less', 'compile-stylus']
  );
}

gulp.task('clean', cleanTask);
gulp.task('build-js', buildJsTask);
gulp.task('dist-css', cssDistTask);
gulp.task('serve', serveTask);
gulp.task('lint', lintTask);
gulp.task('prep-scss', scssPrepTask);
gulp.task('prep-sass', sassPrepTask);
gulp.task('prep-less', lessPrepTask);
gulp.task('prep-stylus', stylusPrepTask);
gulp.task('compile-scss', scssCompileTask);
gulp.task('compile-sass', sassCompileTask);
gulp.task('compile-less', lessCompileTask);
gulp.task('compile-stylus', stylusCompileTask);
gulp.task('build-css', cssBuildTask);


// The dist task will clean and lint files, it will
// then build for the browser and build for node.
gulp.task('dist', ['clean', 'lint'], (cb) => {
  runSequence('dist-css', 'build-js', cb);
});

// The dev task will build the code, then start the server.
// It will also watch for changes in the source and in the
// public dir. If it sees changes it will run build again
// and then refresh the server.
gulp.task('dev', ['clean', 'lint'], () => {
  runSequence(['build-js', 'build-css'], 'serve', () => {
    gulp.watch(['./test/functional/public/index.html', './src/**/*'], () => {
      runSequence('lint', ['build-js', 'build-css'], () => server.reload());
    });
    gulp.watch('./test/functional/public/styles/*', () => {
      runSequence('build-css', () => server.reload());
    });
  });
});
