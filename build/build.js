'use strict'
// build项目
require('./check-versions')() // 检查npm和node的版本

process.env.NODE_ENV = 'production' // 设置环境变量NODE_ENV的值是production

const ora = require('ora') // 终端的spinner
const rm = require('rimraf') // node.js版本的rm -rf
const path = require('path')
const chalk = require('chalk') // 引入显示终端颜色模块
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf') // 引入webpack在production环境下的配置文件

const spinner = ora('building for production...')
spinner.start()

// 删除打包目标目录下的文件
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err // err则抛出错误
  
  // 进行打包
  webpack(webpackConfig, (err, stats) => {
    spinner.stop() // 打包完成
    if (err) throw err// err则抛出错误

    // 输出打包的状态
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    // 如果打包出现错误
    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    // 打包完成
    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
