# webpack-mulit-cdn-plugin

Allows you to set single or mulit cdn path to your own static assets

> Only works with webpack 4 for now

## installation
```sh
npm i webpack-mulit-cdn-plugin -D
```
or
```sh
yarn add webpack-mulit-cdn-plugin -D
```

## Usage

### input

```js
// entry.js
console.log('app')
import(/* webpackChunkName: "asyncChunk1" */ './asyncChunks/async1')
import(/* webpackChunkName: "asyncChunk2" */ './asyncChunks/async2')
```

```js
// webpack.config.js
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
```
### output

index.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>example</title>
</head>

<body>

  <script type="text/javascript" src="//cdn3.example.com/app1.js"></script>
  <script type="text/javascript" src="//cdn2.example.com/app2.js"></script>
  <script type="text/javascript" src="//cdn2.example.com/app3.js"></script>
  <script type="text/javascript" src="//cdn1.example.com/app4.js"></script>
</body>

</html>
```

**`useChunksRandomPath`** : `false`(default)
```js
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Dynamic assets path override (webpack-mulit-cdn-plugin)
/******/ 	__webpack_require__.p = ("//cdn1.example.com/") || __webpack_require__.p;
```
> `useChunksRandomPath: false` means async chunks public path will be defined randomly among the cdnPath list while compiling

**`useChunksRandomPath`** : `true`
```js
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	function randomInt(lowerValue, upperValue) {
/******/ 	  var choices = upperValue - lowerValue
/******/ 	  return Math.floor(Math.random() * choices + lowerValue)
/******/ 	}
/******/ 	var cdnList = ["//cdn1.example.com/","//cdn2.example.com/","//cdn3.example.com/","//cdn4.example.com/"]
/******/ 	// Dynamic assets path override (webpack-mulit-cdn-plugin)
/******/ 	__webpack_require__.p = cdnList[randomInt(0, 4)] || __webpack_require__.p;
```
> `useChunksRandomPath: false` means async chunks public path will be defined among randomly the cdnPath list at broswer runtime

## Thank
- [webpack-runtime-public-path-plugin](https://www.npmjs.com/package/webpack-runtime-public-path-plugin)
- [dynamic-public-path-webpack-plugin](https://www.npmjs.com/package/dynamic-public-path-webpack-plugin)
- [html-webpack-cdn-path-plugin](https://www.npmjs.com/package/html-webpack-cdn-path-plugin)
- [webpack-require-from](https://www.npmjs.com/package/webpack-require-from)

## License
The [MIT License](LICENSE)
