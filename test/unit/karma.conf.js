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
    // browsers: ['Chrome'],
    browsers: ['Chrome_Beta_Headless'],
    customLaunchers: {
      Chrome_Beta_Headless: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--disable-gpu',
          '--remote-debugging-port=9222'
        ]
      },
    },
    // browsers: ['PhantomJS'],
    frameworks: ['mocha', 'sinon-chai'],
    reporters: ['mocha'],
    // reporters: ['spec', 'coverage'],
    // reporters: ['mocha','log-reporter'],
    // reporters: ['spec'],
    // reporters: ['progress'],
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

    // enable / disable colors in the output (reporters and logs)
    colors: true,
    singleRun: true,
    autoWatch: false,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    // logLevel: config.LOG_INFO,
    browserConsoleLogOptions: {
      level: 'debug',
      format: '%b %T: %m',
      // terminal: true,
      terminal: false,
      // node 8 更新后输出 log，发生 warning
      // path: '/users/jomyhuang/downloads/test.log',
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
