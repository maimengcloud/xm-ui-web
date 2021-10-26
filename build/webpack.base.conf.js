'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const webpack = require('webpack')

const pkg = require('../package.json');

const vueLoaderConfig = require('./vue-loader.conf')
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const threadLoader = require('thread-loader');


threadLoader.warmup({
    // pool options, like passed to loader options
    // must match loader options to boot the correct pool
  }, [
    // modules to load
    // can be any module, i. e.
    'vue-loader',
    'css-loader',
    'babel-loader',
    'babel-preset-es2015',
    'sass-loader',
  ]);

var threadLoaderConfig={
    loader: "thread-loader",
    // 有同样配置的 loader 会共享一个 worker 池(worker pool)
    options: {
      // 产生的 worker 的数量，默认是 cpu 的核心数
      //workers: 8,

      // 一个 worker 进程中并行执行工作的数量
      // 默认为 20
      //workerParallelJobs: 20,

      // 额外的 node.js 参数
      //workerNodeArgs: ['--max-old-space-size', '1024'],

      // 闲置时定时删除 worker 进程
      // 默认为 500ms
      // 可以设置为无穷大， 这样在监视模式(--watch)下可以保持 worker 持续存在
      //poolTimeout: 2000,

      // 池(pool)分配给 worker 的工作数量
      // 默认为 200
      // 降低这个数值会降低总体的效率，但是会提升工作分布更均一
      //poolParallelJobs: 200,

      // 池(pool)的名称
      // 可以修改名称来创建其余选项都一样的池(pool)
      name: "my-pool"
    }
} 
const publicCssLoaders=process.env.NODE_ENV === 'production'?[{loader:MiniCssExtractPlugin.loader,options:{publicPath:'../'}},'css-loader','postcss-loader']:[ 'style-loader','css-loader','postcss-loader']

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    include: [resolve('src'), resolve('test')],
    options: {
        formatter: require('eslint-friendly-formatter'),
        emitWarning: !config.dev.showEslintErrorsInOverlay
    }
})

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
        app: './src/main.js'
    },
    output: {
        clean:true,
        path: config.build.assetsRoot, 
        filename: 'js/[name].[contenthash].js',
        pathinfo: false,
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
        }
    },
    // 加载器
    module: {
        // https://doc.webpack-china.org/guides/migrating/#module-loaders-module-rules
        rules: [ 
            //...(config.dev.useEslint ? [createLintingRule()] : []),
            {
                test: /\.vue$/,
                use:[
                    threadLoaderConfig,
                    {
                        loader: 'vue-loader',
                        /** 
                        options:vueLoaderConfig,
                        */
                        options: {
                            postcss: [require('postcss-cssnext')()],
                            loaders: {
                                js: [
                                    { loader: 'cache-loader' },
                                    { loader: 'babel-loader', options: { presets: ['env'] } }
                                ]
                            }, 
                            extractCSS: true,
                            hotReload:true, 
                           
                        },     
                    }
                ]
                
                
            }, 
            {
                test: /\.css$/,
                use: publicCssLoaders,
            }, 
            {
                test: /\.(sa|sc)ss$/,
                use: publicCssLoaders.concat([  
                    // 将 Sass 编译成 CSS
                    'sass-loader',
                ]),
            }, 
            {
                test: /\.less$/,
                use: publicCssLoaders.concat([ 
                    // 将 Sass 编译成 CSS
                    'less-loader',
                ]),
            },
            {
                test: /\.(stylus|styl)$/,
                use: publicCssLoaders.concat([
                    // 将 Sass 编译成 CSS
                    'stylus-loader',
                ]),
            }, 
            { // 配置Babel将ES6+ 转换为ES5
                test: /\.js$/,
                use:[
                    threadLoaderConfig,
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['env'],
                            plugins: ['transform-runtime']
                        }, 
                    },
                ],
                include: resolve('src'), 
            },
            {
                test: /\.svg$/,
                loader: 'svg-sprite-loader',
                include: [resolve('src/icons')],
                options: {
                symbolId: 'icon-[name]'
                }
            },
            {
                test: /\.(png|jpe?g|gif|tif?f|bmp|webp|svg)(\?.*)?$/,
                exclude: [resolve('src/icons')],
                type: 'asset',
                generator: {
                    filename: 'img/[hash][ext][query]'
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, 
                type: 'asset/resource',
                generator: {
                    filename: 'media/[hash][ext][query]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[hash][ext][query]'
                }
            }
        ]

    }, 
    plugins: [
        new VueLoaderPlugin(),
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',  
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true, 
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true, 
                },
            },
        },
    },
}
