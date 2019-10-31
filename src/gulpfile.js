
const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const uglify = require("gulp-uglify");
const config = {
	src: './app/',
	dist: './../docs/'
}

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
	return src(`${config.src}**/*.html`)
		.pipe(dest(config.dist))
}

function css() {
	return src(`${config.src}**/*.css`)
		.pipe(dest(config.dist))
}

function js() {
	return src(`${config.src}**/*.js`, { sourcemaps: true })
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(uglify())
		.pipe(dest(config.dist, { sourcemaps: false }))
}

function assets() {
	return src(`${config.src}images/*.{svg,png,jpg}`)
		.pipe(dest(`${config.dist}images/`))
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

watch(`${config.src}**.*`, reload);
exports.deploy = series(deployTask);
exports.default = series(defaultTask, deployTask, serve);
