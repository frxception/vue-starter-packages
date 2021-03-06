import * as webpack from 'webpack';
import { isProd, merge } from './utils';
import { base } from './base';
import { runtimeRoot } from '../../utils/path';

const HTMLPlugin = require('html-webpack-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

export let client: webpack.Configuration = merge(base, {
  entry: {
    app: runtimeRoot('src/client/index'),
  },
  output: {
    path: runtimeRoot('dist/client'),
    filename: '[name].[chunkHash].js',
    publicPath: '/client/',
    chunkFilename: '[name].[id].[chunkhash].js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
    runtimeChunk: 'single',
  },
  plugins: [
    new webpack.DefinePlugin({ CLIENT: true, SERVER: false }),
    new HTMLPlugin({ template: runtimeRoot('src/index.template.html'), spa: false }),
  ],
}) as any;

if (isProd) {
  client.plugins = (client.plugins || []).concat([
    new ServiceWorkerWebpackPlugin({ entry: runtimeRoot('src/client/sw.ts') }),
    new CompressionPlugin({ algorithm: 'gzip', test: /\.js$|\.css$|\.html$/, threshold: 0, minRatio: 1 }),
  ]);
}

client = require(runtimeRoot('.vue-starter/webpack.config'))(client, 'client');

export default client;
