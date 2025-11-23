// babel-preset-taro 更多选项和默认值：
// https://docs.taro.zone/docs/next/babel-config
module.exports = {
  presets: [
    ['taro', {
      framework: 'react',
      ts: true,
      compiler: 'webpack5',
    }]
  ],
  plugins: [
    ['import', {
      libraryName: '@taroify/core',
      customName: (name) => `@taroify/core/${name}`,
      style: false
    }, '@taroify/core'],
    ['import', {
      libraryName: '@taroify/icons',
      customName: (name) => `@taroify/icons/${name}`,
      style: false
    }, '@taroify/icons']
  ]
}
