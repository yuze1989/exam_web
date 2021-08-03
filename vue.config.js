"use strict";
const path = require("path");
const defaultSettings = require("./src/settings.js");

const debug =  process.env.NODE_ENV !== "production"; //process.env.NODE_ENV !== "test"; // 

function resolve(dir) {
  return path.join(__dirname, dir);
}

const name = defaultSettings.title || "后台管理系统"; // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 9527; // dev port
// 导入compression-webpack-plugin
//const CompressionPlugin = require('compression-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// 定义压缩文件类型
const productionGzipExtensions = ['js', 'css']

module.exports = {
  // 基本路径
  publicPath: "./",
  // 输出文件目录 不写则默认根目录
  outputDir: "dist",
  assetsDir: "static", // 静态资源目录 (js, css, img, fonts)
  // eslint-loader 是否在保存的时候检查
  // lintOnSave: 'error',
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
      // 开发环境配置
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
      // plugins: [
      //   new CompressionPlugin({
      //     algorithm: 'gzip', // 使用gzip压缩
      //     test: /\.js$|\.html$|\.css$/, // 匹配文件名
      //     filename: '[path].gz[query]', // 压缩后的文件名(保持原文件名，后缀加.gz)
      //     minRatio: 1, // 压缩率小于1才会压缩
      //     threshold: 10240, // 对超过10k的数据压缩
      //     deleteOriginalAssets: false, // 是否删除未压缩的源文件，谨慎设置，如果希望提供非gzip的资源，可不设置或者设置为false（比如删除打包后的gz后还可以加载到原始资源文件）
      //   }),
      // ],

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
    // config.plugins.delete("preload"); // TODO: need test
    // config.plugins.delete("prefetch"); // TODO: need test

    // set svg-sprite-loader
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

    // // 添加环境变量   
    // config.plugin("define")  
    // .tap(args => {  
    //     args[0]["process.env"].VUE_APP_ENVBANE = JSON.stringify("环境变量值");  
    //     args[0]["VERSION"]=JSON.stringify("1.2.0");  
    //     return args;  
    // });  

    // config
    // // https://webpack.js.org/configuration/devtool/#development
    // .when(process.env.NODE_ENV === "development",
    //   config => config.devtool("cheap-source-map")
    // );
    // config
    // .when(process.env.NODE_ENV !== "development",
    //   config => {
    //     config
    //       .plugin("ScriptExtHtmlWebpackPlugin")
    //       .after("html")
    //       .use("script-ext-html-webpack-plugin", [{
    //         // `runtime` must same as runtimeChunk name. default is `runtime`
    //         inline: /runtime\..*\.js$/
    //       }])
    //       .end();
    //     config
    //       .optimization.splitChunks({
    //         chunks: "all",
    //         cacheGroups: {
    //           libs: {
    //             name: "chunk-libs",
    //             test: /[\\/]node_modules[\\/]/,
    //             priority: 10,
    //             chunks: "initial" // only package third parties that are initially dependent
    //           },
    //           elementUI: {
    //             name: "chunk-elementUI", // split elementUI into a single package
    //             priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
    //             test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
    //           },
    //           commons: {
    //             name: "chunk-commons",
    //             test: resolve("src/components"), // can customize your rules
    //             minChunks: 3, //  minimum common number
    //             priority: 5,
    //             reuseExistingChunk: true
    //           }
    //         }
    //       });
    //     config.optimization.runtimeChunk("single");
    //   }
    // );
  },
  // vue-loader 配置项
  // https://vue-loader.vuejs.org/en/options.html
  // vueLoader: {},

  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // css相关配置 配置高于chainWebpack中关于css loader的配置
  // css: {
  //   // 是否使用css分离插件 ExtractTextPlugin
  //   extract: true,
  //   // 开启 CSS source maps?是否在构建样式地图，false将提高构建速度
  //   sourceMap: false,
  //   // css预设器配置项
  //   loaderOptions: {},
  //   // 启用 CSS modules for all css / pre-processor files.
  //   modules: false
  // },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores 构建时开启多进程处理babel编译
  //parallel: require('os').cpus().length > 1,
  // 是否启用dll
  // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
  // dll: false,

  // PWA 插件相关配置
  // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  //pwa: {},
  // webpack-dev-server 相关配置
  devServer: {
    open: false,
    host: "0.0.0.0",
    port: port,
    compress: true, // 开启压缩
    https: false,
    hotOnly: false,
    proxy: {
      "^/api": {
        target: 'http://web.369top.top:6098/toparts-app-web/', //'http://train.msjsol.com/toparts-app-web/',//
        ws: false,
        changeOrigin: true
      }
    }
  },
  // 第三方插件配置
  pluginOptions: {
    // ...
  },

};



// 'use strict'
// const path = require('path')
// const defaultSettings = require('./src/settings.js')
// // 导入compression-webpack-plugin
// const CompressionWebpackPlugin = require('compression-webpack-plugin')
// // 定义压缩文件类型
// const productionGzipExtensions = ['js', 'css']

// function resolve(dir) {
//   return path.join(__dirname, dir)
// }

// const name = defaultSettings.title || '我是title'
// // If your port is set to 80,
// // use administrator privileges to execute the command line.
// // For example, Mac: sudo npm run
// const port = 9528 // dev port
// // const port = 8200 // dev port

// // All configuration item explanations can be find in https://cli.vuejs.org/config/
// module.exports = {
//   publicPath: '/',
//   // 输出文件路径，默认为dist
//   outputDir: 'dist',
//   // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
//   assetsDir: 'static',
//   // 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径
//   // indexPath: '',
//   // 保存时 lint 代码
//   lintOnSave: process.env.NODE_ENV === 'development',
//   // 生产环境是否生成 sourceMap 文件
//   productionSourceMap: false,
//   devServer: {
//     host: '0.0.0.0',
//     port: port, // 配置端口
//     open: true, // 自动开启浏览器
//     compress: true, // 开启压缩
//     // 设置让浏览器 overlay 同时显示警告和错误
//     overlay: {
//       warnings: false,
//       errors: true
//     },
//     // 设置请求代理
//     proxy: {
//       '/api/*': {
//         target: 'http://xx.xx.xx.xx:xxxx/',
//         ws: true,
//         changeOrigin: true,
//         pathRewrite: {
//           '^/api': '' // 请求地址
//         }
//       }
//     }
//   },
//   configureWebpack: config => {
//     config.name = name
//     config.resolve.alias['@'] = resolve('src')
//     config.performance = {
//       hints: 'warning',
//       //入口起点的最大体积 整数类型（以字节为单位）
//       maxEntrypointSize: 50000000,
//       //生成文件的最大体积 整数类型（以字节为单位 300k）
//       maxAssetSize: 30000000,
//       //只给出 js 文件的性能提示
//       assetFilter: function(assetFilename) {
//         return assetFilename.endsWith('.js')
//       }
//     }
//     if (process.env.NODE_ENV === 'production') {
//       // 生产环境
//       // 编译时删除console.log
//       config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
//       //  配置productionGzip-高级的方式
//       // 配置参数详解
//       // asset： 目标资源名称。 [file] 会被替换成原始资源。[path] 会被替换成原始资源的路径， [query] 会被替换成查询字符串。默认值是 "[path].gz[query]"。
//       // algorithm： 可以是 function(buf, callback) 或者字符串。对于字符串来说依照 zlib 的算法(或者 zopfli 的算法)。默认值是 "gzip"。
//       // test： 所有匹配该正则的资源都会被处理。默认值是全部资源。
//       // threshold： 只有大小大于该值的资源会被处理。单位是 bytes。默认值是 0。
//       // minRatio： 只有压缩率小于这个值的资源才会被处理。默认值是 0.8。
//       config.plugins.push(
//         new CompressionWebpackPlugin({
//           filename: '[path].gz[query]',
//           algorithm: 'gzip',
//           test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
//           threshold: 10240,
//           minRatio: 0.8
//         })
//       )
//     } else {
//       // 开发环境
//     }
//   },
//   chainWebpack(config) {
//     config.plugins.delete('preload') // TODO: need test
//     config.plugins.delete('prefetch') // TODO: need test

//     // set svg-sprite-loader
//     config.module.rule('svg').exclude.add(resolve('src/icons')).end()
//     config.module.rule('icons').test(/\.svg$/).include.add(resolve('src/icons')).end().use('svg-sprite-loader').loader('svg-sprite-loader').options({
//       symbolId: 'icon-[name]'
//     }).end()

//     // set preserveWhitespace
//     config.module.rule('vue').use('vue-loader').loader('vue-loader').tap(options => {
//       options.compilerOptions.preserveWhitespace = true
//       return options
//     }).end()

//     // https://webpack.js.org/configuration/devtool/#development
//     config.when(process.env.NODE_ENV === 'development',
//       config => config.devtool('cheap-source-map')
//     )

//     config.when(process.env.NODE_ENV !== 'development',
//       config => {
//         config.plugin('ScriptExtHtmlWebpackPlugin').after('html').use('script-ext-html-webpack-plugin', [{
//           // `runtime` must same as runtimeChunk name. default is `runtime`
//           inline: /runtime\..*\.js$/
//         }]).end()
//         config.optimization.splitChunks({
//           chunks: 'all',
//           cacheGroups: {
//             libs: {
//               name: 'chunk-libs',
//               test: /[\\/]node_modules[\\/]/,
//               priority: 10,
//               chunks: 'initial' // only package third parties that are initially dependent
//             },
//             elementUI: {
//               name: 'chunk-elementUI', // split elementUI into a single package
//               priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
//               test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
//             },
//             commons: {
//               name: 'chunk-commons',
//               test: resolve('src/components'), // can customize your rules
//               minChunks: 3, //  minimum common number
//               priority: 5,
//               reuseExistingChunk: true
//             }
//           }
//         })
//         config.optimization.runtimeChunk('single')
//       }
//     )
//   }
// }
