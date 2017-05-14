// Hook to any theme by directing theme name variable
// Must match theme name's folder name
var themename = 'newspaper'; // !!! Title of current project

var gulp = require('gulp'),
	// Call in all tools to be used
        // Prepare and optimize code etc
	autoprefixer = require('autoprefixer'),
	browserSync = require('browser-sync').create(),
	image = require('gulp-image'),
	jshint = require('gulp-jshint'),
	postcss = require('gulp-postcss'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),

	// Only work with new or updated files
	newer = require('gulp-newer'),

        // Set variables
	// Name of working theme folder
	root = '../' + themename + '/',
	scss = root + 'sass/',
	js = root + 'js/',
	img = root + 'images/',
	languages = root + 'languages/';


// CSS via Sass and Autoprefixer
gulp.task('css', function() {
        // Grab any Sass source files
	return gulp.src(scss + '{style.scss,rtl.scss}')
	// Generate source maps
        .pipe(sourcemaps.init())
        // Compilation process
	.pipe(sass({
		outputStyle: 'expanded',
		indentType: 'tab',
		indentWidth: '1'
        // Log any errors in cmd line
	}).on('error', sass.logError))
        // Auto prefix select content for compatibility with older browsers
	.pipe(postcss([
		autoprefixer('last 2 versions', '> 1%')
	]))
        // Write source map into project
	.pipe(sourcemaps.write(scss + 'maps'))
        // Place CSS file in project root, to work with WP
	.pipe(gulp.dest(root));
});

// Optimize images through gulp-image
// To use, place new images in a folder called images/RAW
// Images will automatically be optimized and place in img folder
gulp.task('images', function() {
        // Look for RAW imgs folder content
	return gulp.src(img + 'RAW/**/*.{jpg,JPG,png}')
        // Check if new img
	.pipe(newer(img))
        // Optimize img
	.pipe(image())
        // Replace old with optimized imgs
	.pipe(gulp.dest(img));
});

// JavaScript
// Compression could be added to this task
gulp.task('javascript', function() {
        // Grabs JS folder and looks for any files
	return gulp.src([js + '*.js'])
        // Ensures there are no errors
	.pipe(jshint())
        // Reports Errors
	.pipe(jshint.reporter('default'))
        // Places files back in the JS folder
	.pipe(gulp.dest(js));
});


// Watches entire WP project for any changes
gulp.task('watch', function() {
        // Syncs the browser to your current development environment
        // Allows you to access dev environment from a browser on 
        // a different device that is on the local network
	browserSync.init({
		open: 'external',
		proxy: 'http://localhost:8080/newspaper/', // !!! Live URL of current project
		port: 8080
	});
        // Essentially: if change in file -> run task
	gulp.watch([root + '**/*.css', root + '**/*.scss' ], ['css']);
	gulp.watch(js + '**/*.js', ['javascript']);
	gulp.watch(img + 'RAW/**/*.{jpg,JPG,png}', ['images']);
	gulp.watch(root + '**/*').on('change', browserSync.reload);
});


// Default task (runs at initiation: gulp --verbose)
gulp.task('default', ['watch']);
