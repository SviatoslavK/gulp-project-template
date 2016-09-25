'use strict';

var gulp        = require('gulp'),
    watch       = require('gulp-watch'),
    uglify      = require('gulp-uglify'),
    sass        = require('gulp-sass'),
    rigger      = require('gulp-rigger'),
    cleanCSS    = require('gulp-clean-css'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    cache       = require('gulp-cache'),
    spritesmith = require('gulp.spritesmith'),
    rimraf      = require('rimraf');

var path = {
    build: {
        html: 'build/',
        js: 'build/js',
        css: 'build/css',
        img: 'build/img',
        fonts: 'build/fonts',
        spritesImg: 'build/img/sprite',
        spritesSCSS: 'src/style/partials'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/main.js',
        style: 'src/style/main.scss',
        img: 'src/style/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        sprites: 'src/style/sprite/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        img: 'src/style/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        sprites: 'src/style/sprite/*.*'
    },
    clean: './build'
};

gulp.task('html:build', function() {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html));
});

gulp.task('js:build', function() {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js));
});

gulp.task('style:build', function() {
    gulp.src(path.src.style)
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(gulp.dest(path.build.css));
});

gulp.task('image:build', function(){
    gulp.src(path.src.img)
        .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
    })))
        .pipe(gulp.dest(path.build.img));
});

gulp.task('sprite:build', function() {
    var spriteData =
        gulp.src(path.src.sprites)
    .pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.scss',
        imgPath: '../img/sprite/sprite.png',
    }));

    spriteData.img.pipe(gulp.dest(path.build.spritesImg)); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest(path.build.spritesSCSS)); // путь, куда сохраняем стили
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);

gulp.task('watch', function() {
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
    watch([path.watch.sprites], function(event, cb) {
        gulp.start('sprite:build');
    });
});

gulp.task('clean', function(cb) {
    rimraf(path.clean, cb);
});

gulp.task('clear', function() {
    return cache.clearAll();
});

gulp.task('default', [ 'build', 'watch']);
