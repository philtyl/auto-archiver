import type { Configuration } from 'webpack';

module.exports = {
  entry: {
    background: {
      import: 'src/background.ts',
      runtime: false,
      // asyncChunks: false,
      // chunkLoading: 'import'
    }
  },
  // target: 'web',
  // optimization: {
  //   chunkIds: 'named',
  //   moduleIds: 'named',
  //   concatenateModules: true,
  //   minimize: false,
  //   mangleExports: false,
  //   mergeDuplicateChunks: true,
  //   removeAvailableModules: true,
  //   removeEmptyChunks: true
  // }
} as Configuration;
