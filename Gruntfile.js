module.exports = function (grunt) {
    'use strict';

    var addBanner = function (content) {
        var banner = grunt.config.get('banner');
        banner = grunt.template.process(banner);
        return banner.concat('\n', content);
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        banner: grunt.file.read('banner.txt'),
        year: (function () {
            return new Date().getFullYear();
        })(),

        clean: ['build', 'pkg'],

        copy: {
            js: {
                src: 'src/retina.js',
                dest: 'dist/retina.js',
                options: {
                    process: addBanner
                }
            }
        },

        uglify: {
            build: {
                options: {
                    banner: '<%= banner %>'
                },
                files: {
                    'dist/retina.min.js': 'dist/retina.js'
                }
            }
        },

        compress: {
            pkg: {
                options: {
                    archive: 'pkg/retina-<%= pkg.version %>.zip'
                },
                files: [{
                    src: ['**'],
                    cwd: 'dist/',
                    dest: '/',
                    expand: true
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('default', ['clean', 'copy', 'uglify', 'compress']);
};
