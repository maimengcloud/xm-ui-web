'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf') 
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin') 

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin"); 

const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const env = require('../config/'+process.env.ENV_CONFIG+'.env')

const webpackConfig = merge(baseWebpackConfig, { 
  mode:'production', 
  devtool: config.build.productionSourceMap ? config.build.devtool : false, 
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),   
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      favicon: resolve('favicon.ico'),
      title: 'vue-element-admin',
      path: config.build.assetsPublicPath + config.build.assetsSubDirectory,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
       chunksSortMode: 'auto'
    }), 
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),

    new MiniCssExtractPlugin({
      filename:   "css/[name].[contenthash].css",
      chunkFilename:  "css/[id].[contenthash].css",
    }),
    
    // copy custom static assets
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../static'), to: config.build.assetsSubDirectory
        }
      ],
    }),
    new FriendlyErrorsPlugin({
      onErrors:   utils.createNotifierCallback() 
    }),
  ], 
  optimization: {
      minimize: true,
      minimizer:[
        new CssMinimizerPlugin({
          parallel:true
        }),
        new TerserPlugin({
          extractComments: false,
          minify: TerserPlugin.uglifyJsMinify,
          // `terserOptions` options will be passed to `uglify-js`
          // Link to options - https://github.com/mishoo/UglifyJS#minify-options
          terserOptions: {},
        })
      ],
      splitChunks: {
          chunks: 'all'
      },
  },
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({ 
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
