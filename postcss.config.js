import pxtorem from 'postcss-pxtorem'

export default {
  plugins: [
    pxtorem({
      rootValue: 16,
      propList: ['*'],
      minPixelValue: 2,
      exclude: /node_modules/i,
    }),
  ],
}
