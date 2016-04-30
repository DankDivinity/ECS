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
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default',['concat','watch'])
}