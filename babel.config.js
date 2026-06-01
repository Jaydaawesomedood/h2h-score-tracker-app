module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ["@babel/plugin-proposal-decorators", { "legacy": true }]
    ],
    overrides: [
      {
        test: /\.(ts|tsx)$/,
        plugins: [
          ['@babel/plugin-transform-flow-strip-types', { allowDeclareFields: true }],
          ['@babel/plugin-transform-typescript', { allowDeclareFields: true }],
        ],
      },
    ],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
  };
};
