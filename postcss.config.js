const config = require('./config')

module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-flexbugs-fixes'),
    require('postcss-preset-env')({
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
    }),
    require('postcss-adaptive')({
      remUnit: config.common.remUnit,
      autoRem: config.common.autoRem
    })
  ]
}
