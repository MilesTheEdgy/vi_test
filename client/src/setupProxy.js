const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    createProxyMiddleware({
      target: 'https://projects.muhammed-aldulaimi.com/',
      // pathRewrite: {'^/': '/b2b-iys/'},
      changeOrigin: true,
    })
  );
};