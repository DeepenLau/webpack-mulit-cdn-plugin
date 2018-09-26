function randomInt (lowerValue, upperValue) {
  var choices = upperValue - lowerValue
  return Math.floor(Math.random() * choices + lowerValue)
}

const randomIntString = randomInt.toString()

function bufSettledDynamicPath (path, source) {
  var buf = `
    ${source}

    // Dynamic assets path override (webpack-mulit-cdn-plugin)
    __webpack_require__.p = ("${path}") || __webpack_require__.p;
  `
  return buf
}

function bufRandomDynamicPath (runtimeCdnPath, publicPath, source) {
  const pathList = runtimeCdnPath.map(path => {
    return `"${path}${publicPath}"`
  })
  const buf = `
  ${source}

  ${randomIntString}
  var cdnList = [${pathList}]
  // Dynamic assets path override (webpack-mulit-cdn-plugin)
  __webpack_require__.p = cdnList[randomInt(0, ${runtimeCdnPath.length})] || __webpack_require__.p;
  `
  return buf
}

class WebpackMulitCdnPlugin {
  /**
   * options
   * @param {Array} runtimeCdnPath
   * @param {Array} jsCdnPath
   * @param {Array} cssCdnPath
   * @param {Boolean} useChunksRandomPath
   */
  constructor (options) {
    this._name = 'WebpackMulitCdnPlugin'

    this.useChunksRandomPath = options.useChunksRandomPath
    if (options.hasOwnProperty('useChunksRandomPath')) {
      delete options.useChunksRandomPath
    }

    const optionKeys = Object.keys(options)

    optionKeys.forEach(key => {
      if (!Array.isArray(options[key])) {
        throw new Error(`${key} must be an array`)
      }

      this[key] = options[key]
    })
  }
  apply (compiler) {
    compiler.hooks.compilation.tap(this._name, (compilation) => {
      compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapAsync('Aaa', (data, cb) => {
        data.assets.js = data.assets.js.map(item => {
          return (item = this.jsCdnPath[randomInt(0, this.jsCdnPath.length)] + item)
        })
        data.assets.css = data.assets.css.map(item => {
          return (item = this.cssCdnPath[randomInt(0, this.cssCdnPath.length)] + item)
        })
        cb(null, data)
      })
    })

    compiler.hooks.thisCompilation.tap(this._name, (compilation) => {
      const publicPath = compilation.outputOptions.publicPath
      compilation.mainTemplate.plugin('require-extensions', (source, chunk, hash) => {
        if (this.useChunksRandomPath) {
          return bufRandomDynamicPath(this.runtimeCdnPath, publicPath, source)
        }
        // Default use settled
        return bufSettledDynamicPath(`${this.runtimeCdnPath[randomInt(0, this.runtimeCdnPath.length)]}${publicPath}`, source)
      })
    })
  }
}

module.exports = WebpackMulitCdnPlugin
