'use strict'
// Template version: 1.2.6
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: '',
    assetsPublicPath: '/',
    proxyTable: {
       /**
    	'/api/m1/oauth2client': {
          target: 'http://localhost:7002',
          changeOrigin: true,
          pathRewrite: {
            '^/api/m1/oauth2client': ''
          }
    },
       **/
      /** 
    	'/api/m1/xm': {
            target: 'http://localhost:7067',
            changeOrigin: true,
            pathRewrite: {
              '^/api/m1/xm': '/xm'
            }
      },
      */
       /**
    	'/api/m1/lcode': {
            target: 'http://localhost:7014',
            changeOrigin: true,
            pathRewrite: {
              '^/api/m1/lcode': '/'
            }
      },
      
      /**
    	'/api/m1/arc': {
            target: 'http://localhost:7012',
            changeOrigin: true,
            pathRewrite: {
              '^/api/m1/arc': '/arc'
            }
      },
     
       '/api/m1/sys': {
         target: 'http://localhost:7015',
         changeOrigin: true,
         pathRewrite: {
           '^/api/m1/sys': '/sys'
         }
       },
      **/
      // '/api/m1/pay': {
      //   target: 'http://localhost:7125',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/api/m1/pay': '/pay'
      //   }
      // },
      
      /**
    	'/api/m1/workflow': {
            target: 'http://localhost:7080',
            changeOrigin: true,
            pathRewrite: {
                '^/api/m1/workflow': '/workflow'
              }
          },
          **/
        '/api': {
            target: 'https://www.qingqinkj.com',
            changeOrigin: true,
            pathRewrite: {
                '^/api': '/api'
              }
          }
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8067, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: false,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: false,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'eval',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: '',

    // you can set by youself according to actual condition
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: false,

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
