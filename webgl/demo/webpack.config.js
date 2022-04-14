const HtmlWebpackPlugin = require('html-webpack-plugin')
const fs = require('fs')
const path = require('path')
const env = process.env.NODE_ENV
const isProduction = env === 'production'
const mode = isProduction ? 'production' : 'development'

const appsPath = path.resolve(__dirname, './src/')

module.exports = {
  entry: {
    index: './src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: './index.html',
      template:'./index.html'
    })
  ],
  mode,
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]',
        },
      },
      {
        test: /\.(frag|vert)$/,
        use: 'raw-loader',
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
}
