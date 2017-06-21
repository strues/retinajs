import babel from 'rollup-plugin-babel';
import babili from 'rollup-plugin-babili';
import cleanup from 'rollup-plugin-cleanup';
import flow from 'rollup-plugin-flow';
import multidest from 'rollup-plugin-multi-dest';

// Environment Check.
const isProd = process.env.NODE_ENV === 'production';
// Plugin options objects.
const opts = {
  babel: {
    exclude: 'node_modules/**',
    babelrc: false,
    presets: [
      [
        'env',
        {
          loose: true,
          comments: true,
          modules: false,
          targets: {
            browserslist: ['> 5%', 'last 3 versions'],
          },
        },
      ],
    ],
  },
  flow: { pretty: true },
};

export default {
  entry: 'src/retina.js',
  moduleName: 'retinajs',
  format: 'es',
  sourceMap: true,
  dest: 'es/retina.js',
  plugins: [
    flow(opts.flow),
    multidest([
      {
        format: 'umd',
        dest: 'dist/retina.js',
        plugins: [flow(opts.flow), babel(opts.babel)],
      },
      {
        format: 'umd',
        dest: 'dev/retina.js',
        plugins: [flow(opts.flow), babel(opts.babel)],
      },
      {
        format: 'umd',
        dest: 'dist/retina.min.js',
        plugins: [flow(opts.flow), babel(opts.babel), babili()],
      },
    ]),
    cleanup(),
  ],
};
