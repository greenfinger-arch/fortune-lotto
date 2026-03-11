import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Home, Share2, RefreshCw, ExternalLink, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FENG_SHUI_ELEMENTS, SPOTS } from './constants';

const App = () => {
  // --- [상태 관리] ---
  const [step, setStep] = useState(1); // 1: 진단, 2: 분석, 3: 결과
  const [userChoice, setUserChoice] = useState({ element: null, spot: null });
  const [luckyNumbers, setLuckyNumbers] = useState([]);
  const canvasRef = useRef(null);

  // --- [로직: 풍수 기반 로또 알고리즘] ---
  const generateFortuneNumbers = () => {
    const selectedElement = FENG_SHUI_ELEMENTS[userChoice.element];
    const numbers = new Set();
    const [min, max] = selectedElement.weightRange;

    while (numbers.size < 6) {
      let n;
      const isLuckyHit = Math.random() < 0.4; // 40% 확률로 풍수 가중치 적용
      if (isLuckyHit) {
        n = Math.floor(Math.random() * (max - min + 1)) + min;
      } else {
        n = Math.floor(Math.random() * 45) + 1;
      }
      if (n >= 1 && n <= 45) numbers.add(n);
    }
    return Array.from(numbers).sort((a, b) => a - b);
  };

  // --- [애니메이션 및 단계 제어] ---
  useEffect(() => {
    let animationFrameId;

    if (step === 2) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const particles = [];
        const color = FENG_SHUI_ELEMENTS[userChoice.element]?.color || '#fbbf24';

        for (let i = 0; i < 80; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 3,
            speedY: (Math.random() - 0.5) * 3,
          });
        }

        const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = color;
          particles.forEach((p) => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.speedX += (canvas.width / 2 - p.x) * 0.005;
            p.speedY += (canvas.height / 2 - p.y) * 0.005;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          });
          animationFrameId = requestAnimationFrame(animate);
        };
        animate();
      }

      // 3.5초 후 결과 페이지로 강제 전환 (안정성 확보)
      const timer = setTimeout(() => {
        const results = generateFortuneNumbers();
        setLuckyNumbers(results);
        setStep(3);
        confetti({ 
          particleCount: 150, 
          spread: 70, 
          origin: { y: 0.6 }, 
          colors: [FENG_SHUI_ELEMENTS[userChoice.element].color, '#ffffff'] 
        });
      }, 3500);

      return () => {
        clearTimeout(timer);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      };
    }
  }, [step, userChoice.element]);

  const getThemeColor = () => userChoice.element ? FENG_SHUI_ELEMENTS[userChoice.element].color : '#f59e0b';

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 overflow-hidden relative font-sans">
      
      {/* 배경 은은한 빛 효과 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div 
          className="w-[400px] h-[400px] rounded-full blur-[120px] opacity-10 transition-colors duration-1000"
          style={{ backgroundColor: getThemeColor() }}
        />
      </div>

      <div className="max-w-[420px] w-full bg-slate-900/60 backdrop-blur-3xl rounded-[3rem] shadow-2xl border border-white/10 relative z-10 overflow-hidden">
        
        <header className="pt-12 pb-6 text-center">
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }} 
            transition={{ repeat: Infinity, duration: 5 }}
            className="inline-block mb-3"
          >
            <Sparkles style={{ color: getThemeColor() }} size={32} />
          </motion.div>
          <h1 className="text-xl font-black tracking-widest text-white uppercase px-4">
            2026 황금 기운 추출기
          </h1>
          <p className="text-[10px] text-slate-500 mt-2 tracking-[0.3em] uppercase opacity-70">Fortune Lotto Engine</p>
        </header>

        <main className="px-8 pb-12">
          <AnimatePresence mode="wait">
            
            {/* 1단계: 풍수 진단 */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-8">
                <div>
                  <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 text-center">오늘 나를 이끄는 오행의 기운</h2>
                  <div className="grid grid-cols-5 gap-2">
                    {Object.keys(FENG_SHUI_ELEMENTS).map((key) => (
                      <button
                        key={key}
                        onClick={() => setUserChoice({ ...userChoice, element: key })}
                        className={`py-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center ${userChoice.element === key ? 'border-current bg-white/5 scale-105' : 'border-slate-800 opacity-40 hover:opacity-100'}`}
                        style={{ color: userChoice.element === key ? FENG_SHUI_ELEMENTS[key].color : '#94a3b8' }}
                      >
                        <span className="text-xl font-bold">{FENG_SHUI_ELEMENTS[key].name[0]}</span>
                        <span className="text-[9px] mt-1 font-medium">{FENG_SHUI_ELEMENTS[key].name.split(' ')[1]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 text-center">현재 생기가 머무는 공간</h2>
                  <div className="space-y-3">
                    {SPOTS.map((spot) => (
                      <button
                        key={spot.id}
                        onClick={() => setUserChoice({ ...userChoice, spot: spot.id })}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${userChoice.spot === spot.id ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'}`}
                      >
                        <div className="flex items-center gap-4 text-left">
                          <Home size={18} className={userChoice.spot === spot.id ? 'text-amber-500' : 'text-slate-600'} />
                          <div>
                            <p className="text-sm font-bold text-slate-200">{spot.name}</p>
                            <p className="text-[10px] text-slate-500">{spot.desc}</p>
                          </div>
                        </div>
                        {userChoice.spot === spot.id && <CheckCircle2 size={16} className="text-amber-500" />}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  disabled={!userChoice.element || !userChoice.spot}
                  onClick={() => setStep(2)}
                  className="w-full py-5 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 rounded-2xl font-black uppercase tracking-[0.2em] text-sm disabled:opacity-20 active:scale-95 transition-all shadow-xl shadow-amber-500/10"
                >
                  행운의 기운 분석하기
                </button>
              </motion.div>
            )}

            {/* 2단계: 기운 응축 애니메이션 */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20 text-center relative min-h-[350px] flex flex-col justify-center items-center">
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
                <div className="relative z-10">
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }} 
                    transition={{ repeat: Infinity, duration: 2 }} 
                    className="text-3xl font-black tracking-[0.3em] text-white"
                  >
                    기운 응축 중
                  </motion.div>
                  <p className="text-slate-400 text-xs mt-6 leading-relaxed tracking-widest opacity-80">
                    사용자의 풍수 시드를 기반으로<br/>데이터 행운군을 추출하고 있습니다...
                  </p>
                </div>
              </motion.div>
            )}

            {/* 3단계: 결과 노출 */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8">
                <div className="p-8 bg-slate-800/40 rounded-[2.5rem] border border-white/5 shadow-inner">
                  <h3 className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase mb-8">당신을 위한 맞춤 행운 번호</h3>
                  <div className="flex flex-wrap gap-3 justify-center mb-10">
                    {luckyNumbers.map((num, i) => (
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 + 0.5 }}
                        key={i}
                        className="w-11 h-11 flex items-center justify-center rounded-full font-black text-slate-950 text-base shadow-xl"
                        style={{ backgroundColor: getThemeColor() }}
                      >
                        {num}
                      </motion.div>
                    ))}
                  </div>
                  <div className="bg-slate-950/50 p-5 rounded-2xl border border-white/5">
                    <p className="text-[13px] text-slate-300 leading-relaxed break-keep">
                      "{FENG_SHUI_ELEMENTS[userChoice.element].advice}"
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full py-4 bg-indigo-600 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-indigo-500 transition-all text-sm shadow-lg shadow-indigo-500/20">
                    <Share2 size={18} /> 당첨 기원 결과 공유하기
                  </button>
                  <button className="w-full py-4 border border-slate-800 rounded-2xl flex items-center justify-center gap-2 text-xs text-slate-400 hover:bg-slate-800 transition-all">
                    <ExternalLink size={16} /> 행운을 높여주는 인테리어 소품
                  </button>
                  <button 
                    onClick={() => {setStep(1); setUserChoice({element:null, spot:null});}} 
                    className="pt-6 text-[10px] text-slate-600 flex items-center justify-center gap-1 mx-auto hover:text-slate-400 tracking-widest uppercase transition-colors"
                  >
                    <RefreshCw size={12} /> 다시 분석하기
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default App;