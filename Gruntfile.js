
module.exports = function (grunt) {

	// Load npm plugins to provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.initConfig({
		uglify: {
			main: {
				files: {'pingr.min.js': 'pingr.js'}
			}
		}
	});

	grunt.registerTask('build', [
		'uglify'
	]);
}