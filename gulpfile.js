var gulp = require('gulp'),
    jade = require('gulp-jade'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    watch = require('gulp-watch'),
    minifycss = require('gulp-minify-css'),
    webserver = require('gulp-webserver'),
    zip = require('gulp-zip'),
    clean = require('gulp-clean'),
    run = require('run-sequence'),
    pkg = require(__dirname + '/package.json');

var package_name;

// SASS
gulp.task('css', function() {
  return gulp.src('src/css/*.scss')
    .pipe(sass({ style: 'compressed' }))
    .pipe(gulp.dest('dist/css'))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css'))
});

// JADE
gulp.task('jade', function() {
  return gulp.src('src/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('dist'))
});

// JAVASCR©IPT
gulp.task('js', function() {
  return gulp.src(['src/assets/libs/angular.min.js',
                   'src/assets/libs/angular-route.min.js',
                   'src/assets/libs/angular-resource.min.js',
                   'src/assets/libs/moment.min.js',
                   'src/assets/libs/underscore.min.js',
                   'src/app/app.module.js',
                   'src/app/components/**/*Factory.js',
                   'src/app/components/**/*Controller.js',
                   'src/app/app.routes.js'])
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('dist/js'))
});

// WEB SERVER
gulp.task('webserver', function() {
    return gulp.src('dist')
    .pipe(webserver({
        host: '0.0.0.0',
        livereload: true,
        port: 8080,
        open: false,
        fallback: 'index.html',
        proxies: [{

        }]
    }))
})

// ZIP
gulp.task('zip', ['build'], function() {
    return gulp.src('dist/**')
    .pipe(zip(package_name + '.zip'))
    .pipe(gulp.dest(__dirname));
})

// CLEAN
gulp.task('clean', function() {
    return gulp.src('dist/*', {read: false})
    .pipe(clean({force: true}));
})

// WATCH
gulp.task('watch', function() {
  gulp.watch('src/css/*.scss', ['css']);
  gulp.watch('src/js/*.js', ['js'])
  gulp.watch('src/*.jade', ['jade']);
});

// RELEASE - Build then create a zip with release name
gulp.task('release', ['clean'], function(cb) {
    package_name = [pkg.name, pkg.version].join('-');
    run(['js', 'css', 'jade', 'zip'], function() {
        cb();
    })
});

// SNAPSHOT - Build then create a zip with snapshot name
gulp.task('snapshot', ['clean'], function(cb) {
    package_name = [pkg.name, pkg.version, 'SNAPSHOT'].join('-');
    run(['js', 'css', 'jade', 'zip'], function() {
        cb();
    })
});

// BUILD
gulp.task('build', ['clean'], function(cb) {
    run(['js', 'css', 'jade'], function() {
        cb();
    })
});

gulp.task('default', ['js', 'css', 'jade', 'webserver', 'watch']);
