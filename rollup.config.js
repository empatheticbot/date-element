import resolve from 'rollup-plugin-node-resolve'
import { module } from './package.json'
import { terser } from 'rollup-plugin-terser'

export default [
  {
    input: 'dist/index.js',
    output: {
      file: module,
      format: 'es',
    },
    plugins: [resolve(), terser()],
  },
]
