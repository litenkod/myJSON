
const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const uglify = require("gulp-uglify");

function defaultTask(cb) {
	cb();
}
  
function serve() {
	browserSync.init({
        server: {
			baseDir: "./app",
		},
		port: 5700,
		open: false,
		});
}

function html() {
	return src('app/*.html')
		.pipe(dest('./../'))
}

function css() {
	return src('app/*.css')
		.pipe(dest('./../'))
}

function js() {
	return src('app/**/*.js', { sourcemaps: true })
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(uglify())
		.pipe(dest('./../', { sourcemaps: false }))
}

function assets() {
	return src('app/images/*.{svg,png,jpg}')
		.pipe(dest('./../images/'))
}

function reload(cb) {
	browserSync.reload();
	cb();
}

function deployTask(cb) {
	html();
	css();
	assets();
	js();
	cb();
}

watch('app/**.*', reload);
exports.deploy = series(deployTask);
exports.default = series(defaultTask, serve);
