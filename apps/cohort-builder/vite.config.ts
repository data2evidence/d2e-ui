import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production'
  const isBuild = command === 'build'
  const entryFile = 'main.tsx'

  console.log('Production :', isProduction)
  console.log('Build      :', isBuild)
  console.log('Entry      :', entryFile)

  return {
    define: { 'process.env.NODE_ENV': `"${mode}"` },
    plugins: [react()],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
        'antd/dist': path.resolve(__dirname, '../../node_modules/antd/dist'),
      },
    },

    build: {
      emptyOutDir: true,
      minify: isProduction,
      lib: {
        entry: path.resolve(__dirname, `src/${entryFile}`),
        name: 'cohort-builder',
        formats: ['umd'],
        fileName: (format) => `cohort-builder.${format}.js`,
      },
      target: 'esnext',
      rollupOptions: {
        treeshake: true,
      },
    },
  }
})
