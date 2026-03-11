import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  // Cloudflare Worker에서 경로를 재구성해주므로 루트('/') 기준 빌드
  base: '/', 
  
  plugins: [react()],
  
  build: {
    // 빌드 결과물이 저장될 폴더
    outDir: 'dist',
    // 정적 자산(JS, CSS, 이미지 등)이 저장될 하위 폴더
    assetsDir: 'assets',
    // 빌드 시 기존 dist 폴더를 비움
    emptyOutDir: true,
  },
  
  // 필요한 경우 서버 설정 (로컬 테스트용)
  server: {
    port: 5173,
    strictPort: true,
  }
});