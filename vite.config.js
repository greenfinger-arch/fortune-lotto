// vite.config.js
export default defineConfig({
  base: '/', // 다시 '/'로 수정
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})