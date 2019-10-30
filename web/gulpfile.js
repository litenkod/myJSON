
const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');

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
	return src('app/*.js', { sourcemaps: true })
		.pipe(concat('scripts.js'))
		.pipe(dest('./../', { sourcemaps: false }))
}

function assets() {
	return src('app/*.{svg,png,jpg}')
		.pipe(dest('./../'))
}

function reload(cb) {
	browserSync.reload();
	cb();
}

function deployTask(cb) {
	html();
	css();
	js();
	assets();
	cb();
}

watch('app/**.*', reload);
exports.deploy = series(deployTask);
exports.default = series(defaultTask, serve);
