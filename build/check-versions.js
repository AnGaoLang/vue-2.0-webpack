'use strict'
const chalk = require('chalk') // 在终端为不同字体显示不同的风格
const semver = require('semver') // 解析npm包的version
const packageConfig = require('../package.json') // 引入package.json文件
const shell = require('shelljs') // node版本的uninx shell命令

// 执行命令的函数
function exec (cmd) {
  return require('child_process').execSync(cmd).toString().trim()
}

const versionRequirements = [
  {
    name: 'node',
    // node的版本
    // process.version就是node的版本
    // semver.clean('v8.8.0') => 8.8.0
    currentVersion: semver.clean(process.version),
    // package.json中定义的node版本的范围 
    versionRequirement: packageConfig.engines.node
  }
]

// 相当于 which npm， 如果npm命令存在的话
if (shell.which('npm')) {
  versionRequirements.push({
    name: 'npm',
    currentVersion: exec('npm --version'), // 检查npm的版本 => 5.4.2
    versionRequirement: packageConfig.engines.npm // package.json中定义的npm版本
  })
}

module.exports = function () {
  const warnings = []

  for (let i = 0; i < versionRequirements.length; i++) {
    const mod = versionRequirements[i]

     // semver.satisfies()进行版本之间的比较
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {

      // 如果现有的npm或者node的版本比定义的版本低，则生成一段警告
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      )
    }
  }

  if (warnings.length) {
    console.log('')
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    console.log()

    for (let i = 0; i < warnings.length; i++) {
      const warning = warnings[i]
      console.log('  ' + warning)
    }

    console.log()
    process.exit(1) // 退出程序
  }
}
