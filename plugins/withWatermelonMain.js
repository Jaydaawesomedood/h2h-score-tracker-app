const { withMainApplication } = require('@expo/config-plugins');

module.exports = function withWatermelonMain(config) {
  return withMainApplication(config, (config) => {
    config.modResults.contents = config.modResults.contents
      .split('\n')
      .filter(line =>
        !line.includes('WatermelonDBJSIPackage') &&
        !line.includes('JSIModulePackage')
      )
      .join('\n');

    return config;
  });
};