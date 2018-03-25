module.exports = {
  mode: "development",
  devtool: "true",
  devServer: {
    proxy: [
      {
        context: "/une",
        target: "",
        pathRewrite: { "^/une": "/" },
        secure: false,
        changeOrigin: true
      },
      {
        context: ["**", "!/", "!/main.js", "!/style.css"],
        target: "",
        secure: false,
        changeOrigin: true
      },
    ]
  }
};
