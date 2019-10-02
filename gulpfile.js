/*
 *  File which handles the gulp tasks for the project.
 *  project gulp tasks
 */

const { src, series } = require('gulp');
const eslint = require('gulp-eslint');
const jshint = require('gulp-jshint');

function eslintTask() {
    return src([
        '**/*.js',
        '!node_modules/**',
        '!logs/**',
        '!dist/**',
        '!test/fixtures/**'
    ])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format());
}

function jshintTask() {
    return src([
        '**/*.js',
        '!node_modules/**',
        '!logs/**',
        '!dist/**',
        '!test/fixtures/**'
    ])
        .pipe(jshint({
            lookup: false
        }))
        .pipe(jshint.reporter.call(this, 'default', { verbose: true }));
}


exports.default = series(eslintTask, jshintTask);