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
paths.inputSassDir = paths.inputAssetsDir + '/scss';
paths.mainSass = paths.inputSassDir + '/main.scss';
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


// Task: Sass compilation.
sass.compiler = require( 'node-sass' );

function buildStyles() {
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
}

// Task: Copying script files.
function copyScripts() {
    return gulp.src( paths.inputScripts )
        .pipe( gulp.dest( paths.outputScriptsDir ) )
        .pipe( browserSync.stream() )
        .on( 'error', log.error );
}

// Task: Run Jekyll.
const buildHtml = ( done ) => run( 'jekyll build' ).exec( done );

// Task: Clean output site directory.
function clean( done ) {
    del( paths.cleanGlobs ).then( paths => { done(); } );
}

// Task: Serve and reload the site with Browersync.
function reload( done ) {
    browserSync.reload();
    done();
}

function serve( done ) {
    browserSync.init( {
        server: {
            baseDir: paths.outputSiteDir
        }
    } );
    done();
}

// Watchers.
const watchStyles = () => gulp.watch( paths.inputSassDir + '/*.scss', gulp.series( buildStyles, reload ) );

// Default task.
gulp.task( 'default', gulp.series( clean, gulp.parallel( buildStyles, copyScripts, buildHtml ), serve, watchStyles ) );
