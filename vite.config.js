import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // 배포 경로가 'play.ranklamp.com/fortunelotto' 이므로 
  // 빌드 자산(assets)이 해당 경로를 기준으로 참조되도록 설정합니다.
  base: '/fortunelotto/',
  
  plugins: [react()],
  
  // 빌드 최적화 설정 (선택 사항)
  build: {
    outDir: 'dist',
    // 배포 시 파일명에 해시값을 포함하여 캐시 문제를 방지합니다.
    assetsDir: 'assets',
  }
})