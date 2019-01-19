var gulp = require( 'gulp' );

var autoprefixer = require( 'gulp-autoprefixer' );
var browserSync = require( 'browser-sync' ).create();
var cleancss = require( 'gulp-clean-css' );
var concat = require( 'gulp-concat' );
var del = require( 'del' );
var log = require( 'fancy-log' );
var run = require( 'gulp-run' );
var sass = require( 'gulp-sass' );
var uglify = require( 'gulp-uglify' );

var paths = {};

// General path information.
paths.inputAssetsDir = '_assets';
paths.outputSiteDir = '_site';
paths.foundationDir = 'node_modules/foundation-sites'

// Sass/CSS paths.
paths.mainSass = paths.inputAssetsDir + '/scss/main.scss';
paths.sassLoadDirs = [
    paths.foundationDir + '/scss'
];
paths.outputCssDir = paths.outputSiteDir + '/css';

// JavaScript paths.
paths.inputScripts = [
    paths.foundationDir + '/dist/js/foundation.min.js'
];
paths.outputScriptsDir = paths.outputSiteDir + '/scripts';

// Clean list.
paths.cleanGlobs = [
    paths.outputSiteDir + '/**'
];


// Sass compilation.
sass.compiler = require( 'node-sass' );

gulp.task( 'build:styles', function() {
    return gulp.src( paths.mainSass )
        .pipe( sass( {
            outputStyle: 'nested',
            trace: true,
            includePaths: paths.sassLoadDirs
        } ).on( 'error', sass.logError ) )
        .pipe( autoprefixer( {
            browsers: ['last 2 versions', 'ie >= 9', 'android >= 4.4', 'ios >= 7']
        } ) )
        .pipe( cleancss() )
        .pipe( gulp.dest( paths.outputCssDir ) )
        .pipe( browserSync.stream() )
        .on( 'error', log.error );
} );

// Copying script files.
gulp.task( 'copy:scripts', function() {
    return gulp.src( paths.inputScripts )
        .pipe( gulp.dest( paths.outputScriptsDir ) )
        .on( 'error', log.error );
} );

// Clean output site directory.
gulp.task( 'clean:site', function( done ) {
    del( paths.cleanGlobs ).then( paths => { done(); } );
} );
