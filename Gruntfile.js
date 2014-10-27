'use strict';

var LIVERELOAD_PORT = 35729,
    lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT}),
    gateway = require('gateway'),
    path = require('path'),
    mountFolder = function (connect, dir) {
        return connect.static(require('path').resolve(dir));
    };

module.exports = function(grunt) {

 require('load-grunt-tasks')(grunt);
 require('time-grunt')(grunt);

 var config = {
        app: 'app',
        dist: 'dist'
    };

  grunt.initConfig({

      config: {app: 'app',dist: 'dist'},
      open: {
            app: {
                path: 'http://<%= connect.options.hostname %>:<%= connect.options.port %>/index.php'
            }
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: '127.0.0.1'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            gateway(__dirname + path.sep + config.app, {
                                '.php': 'php-cgi'
                            }),
                            mountFolder(connect, config.app)
                        ];
                    }
                }
            }
        },
        watch: {
            options: {
                dateFormat: function(time) {
                    grunt.log.writeln('The watch finished in ' + time + 'ms at' + (new Date()).toString());
                    grunt.log.writeln('Waiting for more changes...');
                },
                livereload: true
            },
            livereload: {
              options: {
                  livereload: LIVERELOAD_PORT
              },
              files: [
                  '<%= config.app %>/{,*/}*.html',
                  '<%= config.app %>/{,*/}*.php',
                  '<%= config.app %>/assets/sass/*.scss',
                  '<%= config.app %>/assets/less/*.less',
                  '<%= config.app %>/assets/js/*.js',
                  '<%= config.app %>/assets/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
              ]
            }
        }

  });

    grunt.registerTask('default', ['connect','open','watch']);
 

};