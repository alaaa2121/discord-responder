const gulp = require('gulp');
const eslint = require('gulp-eslint');
const spawn = require('child_process').spawn;
const mocha = require('gulp-mocha');

var bot;

const paths = {
  srcFiles: 'src/**/!(_)*.js',
  testFiles: 'test/**/!(_)*.js',
  configFiles: 'src/**/!(_)*.json',
  gulpFile: 'gulpfile.js'
};

gulp.task('test', () =>
  gulp
    .src(paths.testFiles, {read: false})
    .pipe(mocha())
);

gulp.task('lint', () =>
  gulp
    .src([
      paths.srcFiles,
      paths.testFiles,
      paths.gulpFile
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('main', ['lint'], () => {
  if (bot) bot.kill();
  bot = spawn('node', ['src/main.js'], { 'stdio': 'inherit' });
  bot.on('close', (errorCode) => {
    if (errorCode === 8) {
      console.log('Error detected, waiting for changes...');
    }
  });
});

gulp.task('watch', () => {
  gulp.watch([
    paths.srcFiles,
    paths.configFiles
  ], ['main']);
});

gulp.task('default', ['main', 'watch']);

process.on('exit', () => {
  if (bot) bot.kill();
});
