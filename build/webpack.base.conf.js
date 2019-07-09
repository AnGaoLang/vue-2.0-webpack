'use strict'
// dev和prod环境下的公共配置
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

// 生成相对于根目录的绝对路径
function resolve (dir) {
  return path.join(__dirname, '..', dir) //__dirname当前文件绝对路径，'..'因为当前文件不在根目录
}

// eslint的规则
const createLintingRule = () => ({
  test: /\.(js|vue)$/, // 对.js和.vue结尾的文件进行eslint检查
  loader: 'eslint-loader', // 使用eslint-loader
  enforce: 'pre', // enforce的值可能是pre和post。这里表示在调用其他loader之前需要先调用这个规则进行代码风格的检查
  include: [resolve('src'), resolve('test')], // 需要进行eslint检查的文件的目录存在的地方
  options: {
    formatter: require('eslint-friendly-formatter'),  // 文件风格的检查的格式化程序，这里使用的是第三方的eslint-friendly-formatter
    emitWarning: !config.dev.showEslintErrorsInOverlay // 是否需要eslint输出警告信息，eslint的错误和警告会以蒙层(即浏览器的的遮罩层)的方式展现，在config里配置
  }
})

// 下面就是webpack基本的配置信息（可以立即成是开发环境和生产环境公共的配置）
module.exports = {
  
  // webpack解析文件时候的根目录(如果把webpack.config.js)放在了项目的根目录下面，这个配置可以省略
  context: path.resolve(__dirname, '../'),

  // 指定项目的入口文件
  entry: {
    app: ['babel-polyfill', './src/main.js'] // 打babel垫片
  },

  // 项目的输出配置
  output: {
    path: config.build.assetsRoot, // 项目build的时候，生成的文件的存放路径(这里的路径是../dist，config里配置)
    filename: '[name].js', // 生成文件的名称，决定了每个输出 bundle 的名称，使用入口名称
    // filename: '[name].[hash].js', // 使用每次构建过程中，唯一的 hash 生成，以应对缓存问题

    // 输出解析文件的目录，url 相对于 HTML 页面(生成的html文件中，css和js等静态文件的url前缀)
    publicPath: process.env.NODE_ENV === 'production' // 发布公共路径，地址在config里配置
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },

   // 配置模块解析时候的一些选项
  resolve: {
    // 指定哪些类型的文件可以引用的时候省略后缀名
    extensions: ['.js', '.vue', '.json', '.less'],
    // 路径别名
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'componets': resolve('src/components'),
      'utils': resolve('src/utils'),
      'service': resolve('src/service')
    }
  },

   // 下面是针对具体的模块进行的具体的配置
  module: {
    // rules是一个数组，其中的每一个元素都是一个对象，这个对象是针对具体类型的文件进行的配置。
    rules: [
      // Eslint检查的配置
      ...(config.dev.useEslint ? [createLintingRule()] : []),// 根据config里的useEslint判断是否用eslint格式化代码
      {
        // .vue文件的配置
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig // .vue的解析规则
      },
      {
        // .js文件的配置（babel的es6转es5），babel-loader会自动读取根目录下面的.babelrc中的babel配置用于编译js文件，无需在此处设置
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')] // 包含哪些目录下的文件
      },
      // 配置sass：npm install sass-loader node-sass --save-dev 之后，在下面添加sass的处理规则
      // {
      //   test: /\.sass$/,
      //   loaders: ['style', 'css', 'sass']
      // },
      {
        // 对图片资源进行编译的配置，指定文件的类型
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, // 文件匹配正则表达式
        loader: 'url-loader',  // 指定该种类型文件的加载器名称
        options: { // 针对此加载器的具体配置 为字符串或对象。值可以传递到loader中，将其理解为loader选项。
          limit: 10000, // 小于10000byte时会被转换成dataurl
          name: utils.assetsPath('img/[name].[hash:7].[ext]') //生成的文件的保存路径和后缀名称，文件编译打包生成输出的二级目录，函数本体卸载utils里
        }
      },
      {
        // 对视频文件进行打包编译
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        // 对字体文件进行打包编译
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },

  // 打包时将下列依赖移除不打包进vendor,改为在index.html引入(cdn)
  // externals: {
  //     jquery: 'jQuery', // 后面的 jQuery 为路径别名
  //     // String
  //     react: 'react'
  // },

  // 依赖提供插件，无需使用import引入，这里就直接提供了全局的依赖
  // plugins: [
  //   new webpack.ProvidePlugin({
  //     _: 'lodash',
  //     moment: 'moment',
  //   })
  // ],

  // 这些选项用于配置polyfill或mock某些node.js全局变量和模块。
  // 这可以使最初为nodejs编写的代码可以在浏览器端运行
  // 这个配置是一个对象，其中的每个属性都是nodejs全局变量或模块的名称
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    // false表示什么都不提供。如果获取此对象的代码，可能会因为获取不到此对象而触发ReferenceError错误
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    // 设置成empty则表示提供一个空对象
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
};
