# NgRouter Admin Portal - NgRouter网关管理控制台

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/gogo-easy/ngrAdminPortal/blob/master/LICENSE) [![Version](https://img.shields.io/github/v/release/gogo-easy/ngrAdminPortal)](https://github.com/gogo-easy/ngrAdminPortal/releases)

## Quick Start

### 项目安装依赖
```
npm install
```

### 本地环境运行
```
npm run start
```

### 编译打包生产，
```
npm run build
```

### 在config/index.js中，根据不同环境，提供不同的NgrAdmin RESTFUL API域名和端口

```

var path = require('path')
const NODE_ENV = process.env.NODE_ENV

module.exports = {
  build: {
    restfulApi:'http://product.gateway-api.com',
    mode: NODE_ENV,
    sourceMap: false,
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    bundleAnalyzerReport: process.env.analyz
  },
  dev: {
    restfulApi:'http://dev.gateway-api.com',
    mode: NODE_ENV,
    sourceMap: 'source-map',
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    port: 3000,
    autoOpenBrowser: true,
    overlay: true,
    historyApiFallback: true,
    noInfo: true
  },
}


```

###  提供在服务器上pm2启动项目的功能

```
1. 修改config/index, 配置Ngr Admin RESTFUL API server地址。配置一次即可。
    var path = require('path')
    const NODE_ENV = process.env.NODE_ENV

    module.exports = {
      build: {
        restfulApi:'http://product.gateway-api.com',
        mode: NODE_ENV,
        sourceMap: false,
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        bundleAnalyzerReport: process.env.analyz
      },
      dev: {
        restfulApi:'http://dev.gateway-api.com',
        mode: NODE_ENV,
        sourceMap: 'source-map',
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        port: 3000,
        autoOpenBrowser: true,
        overlay: true,
        historyApiFallback: true,
        noInfo: true
      },
    }
2. 本地打包编译。
    npm run build
    
3. 推送代码到远程仓库
    git push origin xxx
    
4. 服务器用pm2起node服务
    npm run pm2_start
    
5. 服务器ip+端口访问，如有需要自行配置ngnix做域名解析

```

### 部署建议

-  NgrAdmin服务与NgrAdminPortal部署在同一应用实例上，NgrAdminPortal访问本地NgrAdmin服务。

## License

The project is licensed by [Apache 2.0](https://github.com/gogo-easy/ngrAdminPortal/blob/master/LICENSE)











