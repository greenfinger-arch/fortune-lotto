// vite.config.js
export default defineConfig({
  base: '/', // 다시 '/'로 변경합니다.
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  }
})