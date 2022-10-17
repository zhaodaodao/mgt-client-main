const path = require("path");

module.exports = {
  publicPath: "./",
  outputDir: "mgt-client", // 打包的目录
  lintOnSave: true, // 在保存时校验格式
  productionSourceMap: false, // 生产环境是否生成 SourceMap
  lintOnSave: false,
  devServer: {
    proxy: process.env.VUE_APP_BASE_URL,
    port: 8080,
  },
  chainWebpack: (config) => {
    // 压缩代码
    if ("production" === process.env.NODE_ENV) {
      config.optimization.minimize(true);
    }
    // 分割代码
    config.optimization.splitChunks({
      chunks: "all",
    });
    // 用cdn方式引入
    config.externals({
      axios: "axios",
    });
    // 标题
    config.plugin("html").tap((args) => {
      args[0].title = "尾矿库监测后台管理系统";
      return args;
    });
    config.resolve.alias
      .set("@", path.join(__dirname, "./src"))
      .set("@assets", path.join(__dirname, "./src/assets"))
      .set("@components", path.join(__dirname, "./src/components"))
      .set("@router", path.join(__dirname, "./src/router"))
      .set("@views", path.join(__dirname, "./src/views"));
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            "primary-color": "#062B78",
            "secondary-color": "#7F8385",
            "link-color": "@primary-color",
            "border-radius-base": "2px",
            "layout-body-background": "#F9F9FB",
            "menu-item-active-bg": "@primary-color",
            "width-xs": "480px",
            "width-sm": "576px",
            "width-md": "768px",
            "width-lg": "992px",
            "width-xl": "1200px",
            "width-xxl": "1600px",
            "width-xxxl": "2000px",
          },
          javascriptEnabled: true,
        },
      },
    },
  },
};
