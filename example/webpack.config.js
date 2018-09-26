const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackMulitCdnPlugin = require('../index')

const cdnPath = [
  '//cdn1.example.com',
  '//cdn2.example.com',
  '//cdn3.example.com',
  '//cdn4.example.com'
]

module.exports = {
  mode: 'development',
  entry: {
    app1: path.resolve(__dirname, './entry1.js'),
    app2: path.resolve(__dirname, './entry2.js'),
    app3: path.resolve(__dirname, './entry3.js'),
    app4: path.resolve(__dirname, './entry4.js')
  },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    chunkFilename: 'chunks/[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, './index.html'),
      inject: true
    }),
    new WebpackMulitCdnPlugin({
      runtimeCdnPath: cdnPath,
      jsCdnPath: cdnPath,
      cssCdnPath: cdnPath,
      useChunksRandomPath: true
    })
  ]
}