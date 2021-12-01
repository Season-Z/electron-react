const proxyConfig = {
  '/api': {
    target: '',
    changeOrigin: true,
    pathRewrite: {
      '/api': ''
    }
  }
}

export default proxyConfig
