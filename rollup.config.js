import filesize from 'rollup-plugin-filesize'
import progress from 'rollup-plugin-progress'
import typescript from 'rollup-plugin-typescript2'
import zip from 'rollup-plugin-zip'

export default {
  input: './src/index.ts',
  output: [
    {
      dir: 'dist',
      format: 'cjs',
    },
  ],
  plugins: [
    progress(),
    typescript({
      tsconfigOverride: {
        exclude: ['__tests__'],
      },
    }),
    filesize(),
    zip({
      file: 'getListBucketObjects.zip',
      dir: 'dist',
    }),
  ],
}
