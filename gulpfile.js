var gulp = require('gulp');
var del = require('del');
var run = require('gulp-run');

const paths = {
    src: ['./src/**/*.js'],
    entry: './index.js',
    dist: './dist/'
}

const webpackConfig = require('./webpack.config.js');

gulp.task('clean', function () {
    return del(['./dist/*']);
});

gulp.task('dist', ['clean'], function () {

    var cmdDev = new run.Command('webpack --mode production', { usePowerShell: true, silent: false });
    var cmdProd = new run.Command('webpack --mode production', { usePowerShell: true, silent: false });

    process.env.USE_ENV = 'web';
    process.env.NODE_ENV = 'dev';
    cmdDev.exec();

    process.env.USE_ENV = 'web';
    process.env.NODE_ENV = 'production';
    cmdProd.exec();

    process.env.USE_ENV = 'node';
    process.env.NODE_ENV = 'dev';
    cmdDev.exec();

    process.env.USE_ENV = 'node';
    process.env.NODE_ENV = 'production';
    cmdProd.exec();
});
