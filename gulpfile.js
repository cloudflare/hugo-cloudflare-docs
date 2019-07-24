const Path         = require('path')
const gulp         = require('gulp')
const gulpif       = require('gulp-if')
const postcss      = require('gulp-postcss')
const cleanCSS     = require('gulp-clean-css')
const autoprefixer = require('autoprefixer')
const rename       = require('gulp-rename')
const stylus       = require('gulp-stylus')
const nib          = require('nib')
const beeper       = require('beeper')
const log          = require('fancy-log')

const joinP = Path.join.bind(null, __dirname)

function handleError (err) {
  log(err)
  beeper()

  this.emit('end')
}

const compressAssets = false
const buildDirectory = './static'

function css () {
	const STYLUS_OPTS = {
		use: [nib()],
		errors: true,
		paths: [
			__dirname,
			joinP('bower_components')
		]
	}

	const minifyOptions = {
		advanced: false
	}

  return gulp
    .src(joinP('./src/styl/*.styl'))
    .pipe(stylus(STYLUS_OPTS))
    .on('error', handleError)
    .pipe(postcss([autoprefixer({remove: false})]))
    .on('error', handleError)
    .pipe(gulpif(compressAssets, cleanCSS(minifyOptions)))
    .on('error', handleError)
    .pipe(rename({extName: '.css'}))
    .pipe(gulp.dest(joinP(buildDirectory, 'css')))
}

function watch () {
	gulp.watch(joinP('./src/**'), css)
}

const buildTasks = [
  css
]

function register (gulp) {
  gulp.task('build', gulp.series(...buildTasks))
  gulp.task('watch', gulp.series(...buildTasks, watch))
}

register(gulp)

module.exports = {register}
