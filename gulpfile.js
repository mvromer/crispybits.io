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
paths.outputSiteGlob = paths.outputSiteDir + '/**';
paths.foundationDir = 'node_modules/foundation-sites'

// Sass/CSS paths.
paths.inputSassDir = paths.inputAssetsDir + '/scss';
paths.inputSassGlob = paths.inputSassDir + '/**/*.scss';
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

// Jekyll input paths.
paths.inputJekyllFiles = [
    '_config.yml',
    'favicon.+(ico|png)',
    '*.+(html|md)',
    '_data/**',
    '_includes/**',
    '_layouts/**',
    '_posts/**'
];

// Clean list.
paths.cleanGlobs = [
    paths.outputSiteGlob
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
function runJekyll( done ) {
    return run( 'jekyll build' ).exec( done );
}

// Task: Build everything.
const build = gulp.series( buildStyles, copyScripts, runJekyll );

// Task: Clean output site directory.
function clean() {
    return del( paths.cleanGlobs );
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
        },
       reloadDelay: 2000
    } );

    gulp.watch( paths.inputSassGlob, gulp.series( buildStyles, reload ) );
    gulp.watch( paths.inputJekyllFiles, gulp.series( runJekyll, reload ) );
    done();
}

// High level tasks.
gulp.task( 'default', serve );
gulp.task( 'build', gulp.series( build, serve ) );
gulp.task( 'rebuild', gulp.series( clean, build, serve ) );
