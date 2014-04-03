module.exports = function (grunt) {
    'use strict';

    var addBanner = function (content, srcPath) {
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

        clean: ['build'],

        copy: {
            README: {
                src: 'README.md',
                dest: 'build/README.md'
            },
            js: {
                src: 'src/retina.js',
                dest: 'build/js/retina-<%= pkg.version %>.js',
                options: {
                    process: addBanner
                }
            },
            less: {
                src: 'src/retina.less',
                dest: 'build/less/retina-<%= pkg.version %>.less',
                options: {
                    process: addBanner
                }
            }
        },

        uglify: {
            build: {
                files: {
                    'build/js/retina-<%= pkg.version %>.min.js': ['src/retina.js']
                }
            }
        },

        compress: {
            pkg: {
                options: {
                    archive: 'retina-<%= pkg.version %>.zip'
                },
                cwd: 'build/',
                src: ['**'],
                dest: 'pkg/'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('default', ['clean', 'copy', 'uglify']);
};
