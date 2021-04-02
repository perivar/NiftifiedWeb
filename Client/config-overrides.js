// config-overrides.js
const path = require('path');

module.exports = {
  webpack(config, env) {
    return config;
  },
  jest(config) {
    return config;
  },
  devServer(configFunction) {
    return (proxy, allowedHost) => {
      const config = configFunction(proxy, allowedHost);
      config.watchOptions.ignored = [path.resolve(__dirname, 'public'), 'node_modules'];
      return config;
    };
  },
  paths(paths, env) {
    return paths;
  }
};
