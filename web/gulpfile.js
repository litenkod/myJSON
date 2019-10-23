
const { series, watch } = require('gulp');
var browserSync = require('browser-sync').create();

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

function reload(cb) {
	browserSync.reload();
	cb();
}

watch('**.*', reload);

exports.default = series(defaultTask, serve);
