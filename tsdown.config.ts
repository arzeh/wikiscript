import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    dts: true,
    entry: ['./src/main.ts'],
    platform: 'node',
    format: ['esm', 'cjs'],
    clean: true,
    sourcemap: true,
    watch: './src',
  }
])
