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

    // Configurable paths
    var config = {
        app: 'app',
        dist: 'dist'
    };

    // Project configuration.
    grunt.initConfig({

        //Read the package.json (optional)
        pkg: grunt.file.readJSON('package.json'),

        // Project settings
        config: config,

        banner: '/*\n<%= pkg.name %> - v<%= pkg.version %>\n' + 'Authored by:<%= pkg.author %>\n' + 'Website: https://aindevonshire.com ' + '\nCopyright (c) <%= grunt.template.today("yyyy") %>\n */',
        usebanner: {
            dist: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>'
                },
                files: {
                    src: ['<%= config.dist %>/assets/js/app.min.js', '<%= config.dist %>/assets/css/main.min.css']
                }
            }
        },
        jshint: {
            all: ['Gruntfile.js']
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    expand: true,
                    src: [
                        '<%= config.dist %>/*'
                    ]
                }]
            }
        },
        cssmin: {
            minify: {
                expand: true,
                cwd: '<%= config.app %>/assets/css/',
                src: ['*.css', '!*.min.css'],
                dest: '<%= config.dist %>/assets/css/',
                ext: '.min.css'
            }
        },
        compass: { // Task
            dev: {
                options: {
                    sassDir: '<%= config.app %>/assets/sass/',
                    cssDir: '<%= config.app %>/assets/css/',
                    imagesDir: '<%= config.app %>/assets/img/',
                    javascriptsDir: '<%= config.app %>/assets/js/',
                    fontsDir: '<%= config.app %>/assets/fonts/',
                    relativeAssets: true,
                    environment: 'development'
                }
            }

        },

        less: {
             development: {
                     options: {
                         paths: ["<%= config.app %>/assets/css"]
                     },
                 files: {"<%= config.app %>/assets/css/main.css":"<%= config.app %>/assets/less/main.less"}
             }
        },

        processhtml: {
            dist: {
                files: {
                    '<%= config.dist %>/index.php':  ['<%= config.app %>/index.php'],
                    '<%= config.dist %>/footer.php': ['<%= config.app %>/footer.php'],
                    '<%= config.dist %>/header.php': ['<%= config.app %>/header.php'],

                }
            }

        },
        uglify: {
            dist: {
                files: {
                    '<%= config.dist %>/assets/js/app.min.js': ['<%= config.app %>/assets/js/*.js'] // make sure we load jQuery first
                }
            }
        },

        // Task configuration.



         imagemin: {
            png: {
              options: {
                optimizationLevel: 7
              },
              files: [
                {
                  // Set to true to enable the following options…
                  expand: true,
                  // cwd is 'current working directory'
                  cwd: '<%= config.app %>/assets/img',
                  src: ['**/*.png'],
                  // Could also match cwd line above. i.e. project-directory/img/
                  dest: '<%= config.dist %>/assets/img/',
                  ext: '.png'
                }
              ]
            },
            jpg: {
              options: {
                progressive: true
              },
              files: [
                {
                  // Set to true to enable the following options…
                  expand: true,
                  // cwd is 'current working directory'
                  cwd: '<%= config.app %>/assets/img',
                  src: ['**/*.jpg'],
                  // Could also match cwd. i.e. project-directory/img/
                 dest: '<%= config.dist %>/assets/img/',
                  ext: '.jpg'
                }
              ]
            }
        },


        uncss: {
            dist: {
                files: {
                    '<%= config.dist %>/assets/css/main.min.css': ['app/*.php'],
                },
                options: {
                    report: 'min' // optional: include to report savings
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
            comp: {
                files: '<%= config.app %>/assets/sass/*.scss',
                tasks: ['compass'],
                options: {
                    spawn: false
                }
            },
            lss: {
                files: '<%= config.app %>/assets/less/*.less',
                tasks: ['less'],
                options: {
                    spawn: false
                }
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
            },
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: ['jshint'],
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'assets/fonts/{,**/}*.*',
                        'assets/vendors/{,**/}*.*',
                        '{,*/}*.html',
                        '{,*/}*.php'
                    ]
                }]
            }

        },

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


    }); //end initConfig

    // These plugins provide necessary tasks.

    // Default task.
    grunt.registerTask('default', ['less','compass','connect','open','watch']);
    grunt.registerTask('build-sass', [
        'clean:dist',
        'imagemin',
        'compass',
        'uglify',
        'uncss:dist',
        'cssmin',
        'copy:dist',
        'processhtml',
        'usebanner'

    ]);
    grunt.registerTask('build-less', [
        'clean:dist',
        'imagemin',
        'less',
        'uglify',
        'uncss',
        'cssmin',
        'copy:dist',
        'processhtml',
        'usebanner'
    ]);

};