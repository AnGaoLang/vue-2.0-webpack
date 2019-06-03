'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.
// 这个文件主要是对开发环境和生产环境的一个基本的配置，该文件内的配置都会导入webpack.dev.config.js或webpack.prod.config.js

const path = require('path')

module.exports = {
  // 开发环境的一个基本配置
  dev: {

    // Paths
    // 编译输出的二级目录
    assetsSubDirectory: 'static',
    // 编译发布的根目录，可配置为资源服务器域名或者cdn域名
    assetsPublicPath: '/',
    // 需要使用proxyTable代理的接口(可以跨域)
    proxyTable: {
      // '/api': {
      //   // target: 'http://39.107.100.23:28002/zhgd/',
      //   //    target: 'http://192.168.1.146:28007/',
      //      target: 'http://192.168.1.110:28007/',
      //      changeOrigin: true,
      //      pathRewrite: {
      //        '^/api': ''
      //    }
      //  },
      //  '/videoSrc': {
      //    target: 'http://61.184.202.35:8081',
      //    changeOrigin: true,
      //    pathRewrite: {
      //      '^/videoSrc': ''
      //    }
      //  }
    },

    // Various Dev Server settings
    host: 'localhost', // 开发时候的访问域名。可以通过环境变量自己设置。
    port: 8080, // 开发时候的访问端口号。如果端口被占用了，会随机分配一个未被使用的端口。

    autoOpenBrowser: true, // 自动打开浏览器

    // 下面两个都是浏览器展示错误的方式
    errorOverlay: true, // 在浏览器是否展示错误蒙层
    notifyOnErrors: true, // 当编译出错的时候，根据config.dev.notifyOnErrors来确定是否需要在桌面右上角显示错误通知框

    // 这个是webpack-dev-servr的watchOptions的一个选项，指定webpack检查文件的方式
    // 因为webpack使用文件系统去获取文件改变的通知。在有些情况下，这个可能不起作用。例如，当使用NFC的时候，
    // vagrant也会在这方面存在很多问题，在这些情况下，使用poll选项（以轮询的方式去检查文件是否改变）可以设定为true
    // 或者具体的数值，指定文件查询的具体周期。
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true, // 是否使用eslint loader去检查代码

    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: true,  // 如果设置为true，在浏览器中，eslint的错误和警告会以蒙层的方式展现

    /**
     * Source Maps
     */
    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map', // source maps的格式

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true, // 指定是否通过在文件名称后面添加一个查询字符串来创建source map的缓存

    cssSourceMap: true // 打开css的source map
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'), // index.html文件的生成的地方

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'), // 编译生成的文件的目录
    assetsSubDirectory: 'static', // 编译生成的静态文件的目录
    // 编译发布的静态资源引用的公共路径，自动替换项目中引用的静态资源的相对路径
    // 最后打包后项目静态资源的引用路径将会自动替换为：output.publicPath + 资源loader或插件等配置路径
    // 可配置为资源服务器域名或者cdn域名
    assetsPublicPath: '/', 

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false, // 是否开启生产环境的gzip压缩
    productionGzipExtensions: ['js', 'css'], // 开启gzip压缩的文件的后缀名称

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    // bundleAnalyzerReport: process.env.npm_config_report // 如果这个选项是true的话，那么则会在build后，会在浏览器中生成一份bundle报告
    bundleAnalyzerReport: true
  }
}
