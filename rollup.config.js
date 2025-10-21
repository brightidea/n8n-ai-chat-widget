import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import svgr from '@svgr/rollup';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
      exports: 'named',
    },
  ],
  external: ['react', 'react-dom'],
  plugins: [
    svgr(),
    resolve(),
    commonjs(),
    postcss({
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
      extensions: ['.css'],
      minimize: true,
      inject: false,
      extract: 'index.css',
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
      exclude: ['**/*.test.ts', '**/*.test.tsx'],
    }),
  ],
};
