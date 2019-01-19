var gulp = require( 'gulp' );

var autoprefixer = require( 'gulp-autoprefixer' );
var browserSync = require( 'browser-sync' ).create();
var cleancss = require( 'gulp-clean-css' );
var concat = require( 'gulp-concat' );
var log = require( 'fancy-log' );
var run = require( 'gulp-run' );
var sass = require( 'gulp-sass' );
var uglify = require( 'gulp-uglify' );

var paths = {};
paths.mainSass = '_assets/scss/main.scss';
paths.sassLoadDirs = [
    'node_modules/foundation-sites/scss'
];
paths.outputCssDir = '_site/css';


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
