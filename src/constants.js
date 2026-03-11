/**
 * Project: 2026 Fortune Lotto Engine
 * Purpose: Centralized data for Feng Shui logic and UI themes
 */

export const FENG_SHUI_ELEMENTS = {
  WOOD: {
    name: '木 (목)',
    color: '#22c55e', // green-500
    description: '성장과 시작의 기운',
    weightRange: [1, 15], // 1~15번대 가중치
    advice: '새로운 기운이 당신의 번호에 생명력을 불어넣었습니다.'
  },
  FIRE: {
    name: '火 (화)',
    color: '#ef4444', // red-500
    description: '확산과 명예의 기운',
    weightRange: [21, 35], // 20~30번대 가중치
    advice: '강렬한 불의 에너지가 폭발적인 행운을 끌어당깁니다.'
  },
  EARTH: {
    name: '土 (토)',
    color: '#d97706', // amber-600
    description: '안정과 결실의 기운',
    weightRange: [11, 25], // 10~20번대 가중치
    advice: '흔들리지 않는 대지의 기운이 재물운을 단단히 고정합니다.'
  },
  GOLD: {
    name: '金 (금)',
    color: '#94a3b8', // slate-400
    description: '결단과 재물의 기운',
    weightRange: [31, 45], // 30~45번대 가중치
    advice: '예리한 금속의 기운이 당첨 번호를 정밀하게 타격합니다.'
  },
  WATER: {
    name: '水 (수)',
    color: '#3b82f6', // blue-500
    description: '지혜와 흐름의 기운',
    weightRange: [1, 10, 36, 45], // 양 끝단 가중치
    advice: '유연한 물의 흐름이 막힘 없는 행운을 가져다줄 것입니다.'
  }
};

export const SPOTS = [
  { id: 'entrance', name: '현관', desc: '좋은 기운이 들어오는 통로' },
  { id: 'bedroom', name: '침실', desc: '에너지가 응축되고 재충전되는 곳' },
  { id: 'living', name: '거실', desc: '가족의 화합과 기운이 퍼지는 중심' }
];