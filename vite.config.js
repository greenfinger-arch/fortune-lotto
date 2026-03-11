import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // 중요: 서브 경로(/fortunelotto/) 배포를 위해 base를 수정합니다.
  base: '/fortunelotto/', 
  
  plugins: [react()],
  
  build: {
    // 빌드 결과물이 저장될 폴더명
    outDir: 'dist',
    // 자산(JS, CSS, 이미지)이 저장될 폴더명
    assetsDir: 'assets',
    // 빌드 시 기존 dist 폴더를 비우고 새로 생성
    emptyOutDir: true,
  }
})