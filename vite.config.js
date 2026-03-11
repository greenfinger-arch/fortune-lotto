import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // 배포 경로를 루트('/')로 설정하여 MIME 에러를 방지합니다.
  base: '/',
  
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