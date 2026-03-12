import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  /* 가장 중요한 수정: base를 다시 '/'로 되돌립니다.
    이제 앱은 복잡한 경로 계산 없이 fortune-lotto.pages.dev의 루트에서 
    직접 자원을 가져오게 되어 MIME 에러나 경로 깨짐 현상이 완전히 사라집니다.
  */
  base: '/', 
  
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 빌드 시 이전 파일들을 깨끗이 지우고 새로 생성합니다.
    emptyOutDir: true,
  }
});