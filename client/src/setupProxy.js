const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/b2b-iys',
    createProxyMiddleware({
      target: 'https://projects.muhammed-aldulaimi.com',
      changeOrigin: true,
    })
  );
};