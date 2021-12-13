"use strict";
const path = require("path");
const defaultSettings = require("./src/settings.js");

const debug =  process.env.NODE_ENV !== "production";
function resolve(dir) {
  return path.join(__dirname, dir);
}

const name = defaultSettings.title || "后台管理系统";

const port = process.env.port || process.env.npm_config_port || 9527;
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// 定义压缩文件类型
const productionGzipExtensions = ['js', 'css']

module.exports = {
  publicPath: "./",
  outputDir: "dist",
  assetsDir: "static",
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    }
  },

  configureWebpack: config => {
    // webpack配置，值位对象时会合并配置，为方法时会改写配置
    if (debug) {
      config.devtool = "cheap-module-eval-source-map";
    } else {
      // 生产环境配置
      //  配置productionGzip-高级的方式
      // 配置参数详解
      // asset： 目标资源名称。 [file] 会被替换成原始资源。[path] 会被替换成原始资源的路径， [query] 会被替换成查询字符串。默认值是 "[path].gz[query]"。
      // algorithm： 可以是 function(buf, callback) 或者字符串。对于字符串来说依照 zlib 的算法(或者 zopfli 的算法)。默认值是 "gzip"。
      // test： 所有匹配该正则的资源都会被处理。默认值是全部资源。
      // threshold： 只有大小大于该值的资源会被处理。单位是 bytes。默认值是 0。
      // minRatio： 只有压缩率小于这个值的资源才会被处理。默认值是 0.8。
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8
        })
      )
    }


    Object.assign(config, {
      // 开发生产共同配置
      name: name,
      resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
          "@": path.resolve(__dirname, "./src") //设置路径别名
          //...
        }
      },
      externals: {
        // 'vue': 'Vue',
        // 'vue-router': 'VueRouter',
        // 'element-ui': 'ELEMENT',
        // 'vuex':'Vuex',
        //  'axios': 'axios',
      }
    });

  },
  chainWebpack(config) {
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();
    config
      .plugin('html')
      .tap(args => {
        args[0].title = '后台管理系统'
        return args
      })

  },
  productionSourceMap: false,
  devServer: {
    open: false,
    host: "0.0.0.0",
    port: port,
    compress: true, // 开启压缩
    https: false,
    hotOnly: false,
    proxy: {
      "^/api": {
        target: 'http://47.96.236.194:8088', //'http://train.msjsol.com/toparts-app-web/',//
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  // 第三方插件配置
  pluginOptions: {
    // ...
  },

};




