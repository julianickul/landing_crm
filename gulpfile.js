const gulp = require("gulp");
const { src, dest, parallel, series } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const del = require('del');



var paths = {
  styles: {
    src: 'src/scss/**/*.scss',
    srccompiled: 'src/css/',
    dest: 'dist/styles/'
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'dist/js/'
  },
  html: {
    src: 'src/pages/*.pug',
    watchsrc: 'src/pages/**/*.pug',
    dist: 'dist/'
  },
  svg: {
    src: 'src/svg/*',
    dist: 'dist/images/'
  },
  images: {
    src: 'src/images/**/*',
    dest: 'dist/images/'
  }

};

// Development Tasks
// -----------------

function clean() {
  //return del([ 'dist' ]);
  return del(['dist/**']);
}

function css() {
  return src(paths.styles.src)
    .pipe(sass())
    .pipe(dest(paths.styles.srccompiled))
    .pipe(minifyCSS({ comments: 'first-exclamation' }))
    .pipe(src(paths.styles.srccompiled + "**/*.css"))
    .pipe(dest(paths.styles.dest));
}
function copy_images() {
  return gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest))
}
function js() {
  return src(paths.scripts.src, { sourcemaps: true })
    .pipe(dest(paths.scripts.dest, { sourcemaps: true }))
}

function html() {
  return src(paths.html.src)
    .pipe(pug({
      pretty: true
    }))
    .pipe(dest(paths.html.dist))
}
function watch() {
  gulp.watch(paths.styles.src, css);
  gulp.watch(paths.html.watchsrc, html);
  gulp.watch(paths.images.src, copy_images);
  gulp.watch(paths.scripts.src, js);
}

exports.css = css;
exports.html = html;
exports.copy_images = copy_images;
exports.js = js;
exports.clean = clean;
exports.watch = watch;
exports.build = series(clean, parallel(html, css, copy_images, js));
exports.default = series(parallel(html, css, copy_images, js), watch);