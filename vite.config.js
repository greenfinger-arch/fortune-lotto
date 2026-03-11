import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // 중요: 브라우저가 /fortunelotto/assets/... 경로로 파일을 요청하게 만듭니다.
  base: '/fortunelotto/', 
  
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  }
});