const gulp = require('gulp')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const livereload = require('gulp-livereload')

gulp.task('compressDR', () => {
  console.log(__dirname)
  gulp.src('./jquery.1.js')
    .pipe(uglify())
    .pipe(rename('result.js'))
    .pipe(gulp.dest('./'))
})

gulp.task('watch', () => {
  livereload.listen()
  gulp.watch('./jquery.1.js', ['compressDR'])
})