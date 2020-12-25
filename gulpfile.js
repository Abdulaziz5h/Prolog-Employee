var gulp       = require('gulp')
    sass       = require('gulp-sass'),
    pug        = require('gulp-pug'),
    concat     = require('gulp-concat'),
    prefix     = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify     = require('gulp-uglify'),
    // note = require('gulp-notify'),
    zip        = require('gulp-zip'),
    babel      = require('gulp-babel'),
    ftp        = require('vinyl-ftp');


var distHtml = "dist",
    viewSrc = "src/view/**/*.pug",
    distCss = "dist/css",
    sassScr = [
    "src/sass/**/*.scss"
    ],
    distJs = "dist/js",
    jsScr = [
        "src/scripts/*.js"
    ],
    zip_ftp_Src = "dist/**/*.*";

;



gulp.task('html', function(){
    require("./server.js");
    return gulp.src(viewSrc)
    .pipe(pug({pretty : true}))
    .pipe(gulp.dest(distHtml))
    // .pipe(note('gulp watch was sccuess'))
    .pipe(livereload());
});

gulp.task('css', function () {
    return gulp.src(sassScr)
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle : 'compressed'}))
        .pipe(prefix('last 2 versions'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(distCss))
        .pipe(livereload());
});

gulp.task('js', function () {
    return gulp.src(jsScr)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(gulp.dest(distJs))
        .pipe(livereload());
});

gulp.task('zip',function(){
    return gulp.src(zip_ftp_Src)
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('.'));
        // .pipe(note('project is compressed'));
})

gulp.task('deploy', function () {

    var conn = ftp.create({
        host: 'mywebsite.tld',
        user: 'MyUserName',
        password: 'MyPass',
        parallel: 10
    });

    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance

    return gulp.src(globs, { base: '.', buffer: false })
        .pipe(conn.newer('/public_html')) // only upload newer files
        .pipe(conn.dest('/public_html'))
        .pipe(livereload());

});


gulp.task('watch',function(){
    require('./server.js');
    livereload.listen();
        gulp.watch(viewSrc,gulp.series('html'));
        gulp.watch(sassScr, gulp.series('css'));
        gulp.watch(jsScr, gulp.series('js'));
        //gulp.watch(zip_ftp_Src, gulp.series('zip'));
        //gulp.watch(zip_ftp_Src, gulp.series('deploy'));
    
});


gulp.task('default',gulp.parallel('html','css','js','watch'));