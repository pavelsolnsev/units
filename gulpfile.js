var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	svgmin = require("gulp-svgmin"),
	svgSprite = require("gulp-svg-sprite"),
	minify = require("gulp-csso"),
	replace = require("gulp-replace"),
	prettyHtml = require("gulp-pretty-html"),
	cheerio = require("gulp-cheerio"),
	rename = require("gulp-rename"),
	del = require('del'),
	gcmq = require('gulp-group-css-media-queries'),
	autoprefixer = require('gulp-autoprefixer');

gulp.task('browser-sync', function () {
	browserSync.init({
		server: {
			baseDir: "app/"
		}
	});
});

gulp.task('clean', async function () {
	del.sync('dist');
});

gulp.task('scss', function () {
	return gulp.src('app/scss/**/*.scss')
		.pipe(sass({ outputStyle: 'expanded' }))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(gcmq())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.stream());
});

gulp.task('css', function () {
	return gulp.src([
		'node_modules/normalize.css/normalize.css',
		'node_modules/bootstrap/dist/css/bootstrap.min.css'
	])
		.pipe(concat('libs.css'))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.stream());
});

gulp.task('script', function () {
	return gulp.src('app/js/*.js')
		.pipe(browserSync.stream());
});

gulp.task('cssmin', function () {
	return gulp.src('app/css/**/*.css')
		.pipe(concat('style.css'))
		.pipe(rename({ suffix: '.min', prefix: '' }))
		.pipe(minify())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.stream());
});

gulp.task('script', function () {
	return gulp.src('app/js/*.js')

		.pipe(browserSync.stream());
});

gulp.task('html', function () {
	return gulp.src('app/*.html')
		.pipe(prettyHtml({
			indent_size: 2,
			indent_char: ' ',
			unformatted: ['code', 'pre', 'em', 'strong', 'span', 'i', 'b', 'br']
		}))
		.pipe(browserSync.stream());
});

gulp.task('imagemin', function () {
	return gulp.src('app/img/**/*.{png,jpg,gif}')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'));
});

gulp.task('svgSpriteBuild', function () {
	return gulp.src('app/img/icon-svg/*.svg')
		// minify svg
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		// remove all fill, style and stroke declarations in out shapes
		// .pipe(cheerio({
		// 	run: function ($) {
		// 		$('[fill]').removeAttr('fill');
		// 		$('[stroke]').removeAttr('stroke');
		// 		$('[style]').removeAttr('style');
		// 	},
		// 	parserOptions: {xmlMode: true}
		// }))
		// cheerio plugin create unnecessary string '&gt;', so replace it.
		.pipe(replace('&gt;', '>'))
		// build svg sprite
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: "../sprite.svg",
				}
			}
		}))
		.pipe(gulp.dest('app/img/icon-svg/images'));
});

gulp.task('build', async function () {
	var buildHtml = gulp.src('app/**/*.html')
		.pipe(gulp.dest('dist'));

	var BuildCss = gulp.src('app/css/**/*.css')
		.pipe(gulp.dest('dist/css'));

	var BuildJs = gulp.src('app/js/**/*.js')
		.pipe(gulp.dest('dist/js'));

	var BuildFonts = gulp.src('app/fonts/**/*.*')
		.pipe(gulp.dest('dist/fonts'));

	var Buildsvg = gulp.src('app/img/**/*.svg')
		.pipe(gulp.dest('dist/img'));
});

gulp.task('watch', function () {
	gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'));
	gulp.watch('app/js/*.js', gulp.parallel('script'));
	gulp.watch('app/*.html', gulp.parallel('html'));
	gulp.watch('app/img/icon-svg/images*.svg', gulp.parallel('svgSpriteBuild'));
});

gulp.task('dist', gulp.series('clean', gulp.parallel('build', 'imagemin')));

gulp.task('default', gulp.parallel('css', 'script', 'svgSpriteBuild', 'scss', 'browser-sync', 'watch'));
