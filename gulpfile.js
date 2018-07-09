var gulp = require('gulp');
var server = require('gulp-webserver');
var list = require('./data/data.json');
var uglify = require('gulp-uglify');
var minCss = require('gulp-clean-css');
var babel = require('gulp-babel');
var htmlmin = require('gulp-htmlmin');
// 起服务
gulp.task('server',() => {
    gulp.src('src')
    .pipe(server({
        port: 9090,
        middleware: function (req, res) {
            var pathname = require('url').parse(req.url).pathname;
            if (pathname === '/favicon.ico') {
                return false;
            }
            if (pathname === '/api/list') {
                res.end(JSON.stringify({code: 1, msg: list}))
            } else {
                pathname = pathname === '/' ? '/index.html' : pathname;
                res.end(require('fs').readFileSync(require('path').join(__dirname, 'src', pathname)));
            }
        }
    }))
})

// js
gulp.task('uglify', () => {
    gulp.src('./src/js/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./src/js'))
});

// 压缩css
gulp.task('minCss', function () {
    gulp.src('./src/css/*.css')
    .pipe(minCss())
    .pipe(gulp.dest('./build/css'))
});

// 压缩html
gulp.task('minhtml', function () {
    gulp.src('./src/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true 
        }))
        .pipe(gulp.dest('build'))
});