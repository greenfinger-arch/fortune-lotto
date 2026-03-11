import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // 1. 하위 경로 배포를 위한 핵심 설정 (앞뒤 슬래시 필수)
  base: '/fortunelotto/',
  
  plugins: [react()],
  
  build: {
    // 2. 빌드 결과물 저장 폴더
    outDir: 'dist',
    // 3. 자산 폴더 (dist/assets)
    assetsDir: 'assets',
    // 4. 빌드 전 기존 dist 폴더를 깨끗이 비움 (경로 꼬임 방지)
    emptyOutDir: true,
    // 5. 디버깅 정보 제외하여 빌드 속도 및 용량 최적화
    sourcemap: false,
    // 6. 롤업 최적화
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  
  // 로컬 개발 서버 설정
  server: {
    port: 3000,
    strictPort: true,
    host: true,
  }
})