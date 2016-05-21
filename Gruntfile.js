module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      js: {
        src: ['js/main.js', 'js/**/*.js'],
        dest: 'build/script.js',
      },
    },
    watch: {
      js: {
        files: ['js/**/*.js'],
        tasks: ['concat:js'],
      },
    },
    connect: {
      options: {
        port: 8080,
        open: true,
        liverload: 35729,
        hostname: "0.0.0.0"
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-connect');
  grunt.registerTask('default',['concat','watch']);
}