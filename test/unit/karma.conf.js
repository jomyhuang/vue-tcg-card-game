// This is a karma config file. For more details see
//   http://karma-runner.github.io/0.13/config/configuration-file.html
// we are also using it with karma-webpack
//   https://github.com/webpack/karma-webpack

var webpackConfig = require('../../build/webpack.test.conf')

module.exports = function (config) {
  config.set({
    // to run in additional browsers:
    // 1. install corresponding karma launcher
    //    http://karma-runner.github.io/0.13/config/browsers.html
    // 2. add it to the `browsers` array below.
    browsers: ['Chrome'],
    // browsers: ['PhantomJS'],
    frameworks: ['mocha', 'sinon-chai'],
    // reporters: ['spec', 'coverage'],
    // reporters: ['mocha'],
    reporters: ['mocha','log-reporter'],
    // reporters: ['spec'],
    files: [
      '../../node_modules/babel-polyfill/dist/polyfill.js',
      './index.js'
    ],
    preprocessors: {
      './index.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },

    // captureTimeout: 60000,
    // browserDisconnectTimeout : 10000,
    // browserDisconnectTolerance : 1,
    // browserNoActivityTimeout : 100000,

    // enable / disable colors in the output (reporters and logs)
    colors: true,
    singleRun: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    // logLevel: config.LOG_INFO,
    browserConsoleLogOptions: {
      level: 'log',
      format: '%b %T: %m',
      // terminal: true,
      terminal: false,
    },

    logReporter: {
      outputPath: './test',
      logFileName: 'logfile.log',
    },

    // mochaReporter: {
    //       output: 'autowatch',
    // }

    // coverageReporter: {
    //   dir: './coverage',
    //   reporters: [
    //     { type: 'lcov', subdir: '.' },
    //     { type: 'text-summary' }
    //   ]
    // }
  })
}
