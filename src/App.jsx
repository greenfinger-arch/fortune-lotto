import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Home, Wind, CheckCircle2, Share2, RefreshCw, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FENG_SHUI_ELEMENTS, SPOTS } from './constants';

const App = () => {
  // --- [State Management] ---
  const [step, setStep] = useState(1); // 1: Diagnosis, 2: Gathering, 3: Result
  const [userChoice, setUserChoice] = useState({ element: null, spot: null });
  const [luckyNumbers, setLuckyNumbers] = useState([]);
  const canvasRef = useRef(null);

  // --- [Logic: Lotto Algorithm] ---
  const generateFortuneNumbers = () => {
    const selectedElement = FENG_SHUI_ELEMENTS[userChoice.element];
    const numbers = new Set();
    
    // 풍수적 가중치 설정 (특정 대역의 확률을 미세하게 상승)
    const [min, max] = selectedElement.weightRange;

    while (numbers.size < 6) {
      let n;
      const isLuckyHit = Math.random() < 0.4; // 40% 확률로 가중치 대역에서 추출
      if (isLuckyHit) {
        n = Math.floor(Math.random() * (max - min + 1)) + min;
      } else {
        n = Math.floor(Math.random() * 45) + 1;
      }
      if (n >= 1 && n <= 45) numbers.add(n);
    }
    return Array.from(numbers).sort((a, b) => a - b);
  };

  // --- [Animation: Canvas Particle System] ---
  useEffect(() => {
    if (step === 2 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      let animationFrameId;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles = [];
      const color = FENG_SHUI_ELEMENTS[userChoice.element]?.color || '#fbbf24';

      for (let i = 0; i < 100; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 5,
          speedY: (Math.random() - 0.5) * 5,
        });
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = color;
        particles.forEach((p) => {
          p.x += p.speedX;
          p.y += p.speedY;
          // 중심부(에너지 응축)로 모이는 효과
          p.speedX += (canvas.width / 2 - p.x) * 0.001;
          p.speedY += (canvas.height / 2 - p.y) * 0.001;
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
        animationFrameId = requestAnimationFrame(animate);
      };
      animate();
      
      const timer = setTimeout(() => {
        cancelAnimationFrame(animationFrameId);
        setLuckyNumbers(generateFortuneNumbers());
        setStep(3);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: [color, '#ffffff'] });
      }, 4000);

      return () => {
        clearTimeout(timer);
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [step]);

  const getThemeColor = () => userChoice.element ? FENG_SHUI_ELEMENTS[userChoice.element].color : '#f59e0b';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 overflow-hidden relative font-sans">
      
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-20 transition-colors duration-1000"
          style={{ backgroundColor: getThemeColor() }}
        />
      </div>

      <div className="max-w-md w-full bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-slate-800/50 relative z-10">
        
        <header className="pt-10 pb-6 text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="inline-block mb-4">
            <Sparkles style={{ color: getThemeColor() }} size={32} />
          </motion.div>
          <h1 className="text-2xl font-black tracking-tighter italic">FORTUNE ENGINE 2026</h1>
          <div className="h-1 w-12 bg-amber-500 mx-auto mt-2 rounded-full" />
        </header>

        <main className="px-8 pb-10">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Diagnosis */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-8">
                <div>
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">Select Dominant Element</h2>
                  <div className="grid grid-cols-5 gap-2">
                    {Object.keys(FENG_SHUI_ELEMENTS).map((key) => (
                      <button
                        key={key}
                        onClick={() => setUserChoice({ ...userChoice, element: key })}
                        className={`py-4 rounded-2xl border-2 transition-all ${userChoice.element === key ? 'border-current scale-105 bg-white/5' : 'border-slate-800 opacity-40'}`}
                        style={{ color: userChoice.element === key ? FENG_SHUI_ELEMENTS[key].color : '#94a3b8' }}
                      >
                        <span className="text-xl font-bold block">{FENG_SHUI_ELEMENTS[key].name[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">Focus On Your Space</h2>
                  <div className="space-y-3">
                    {SPOTS.map((spot) => (
                      <button
                        key={spot.id}
                        onClick={() => setUserChoice({ ...userChoice, spot: spot.id })}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${userChoice.spot === spot.id ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-800/20'}`}
                      >
                        <div className="flex items-center gap-4">
                          <Home size={20} className={userChoice.spot === spot.id ? 'text-amber-500' : 'text-slate-600'} />
                          <div className="text-left">
                            <p className="text-sm font-bold">{spot.name}</p>
                            <p className="text-[10px] text-slate-500">{spot.desc}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  disabled={!userChoice.element || !userChoice.spot}
                  onClick={() => setStep(2)}
                  className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest disabled:opacity-20 transition-all active:scale-95"
                >
                  Analyze My Energy
                </button>
              </motion.div>
            )}

            {/* STEP 2: Animation (Canvas) */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20 text-center relative">
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
                <div className="relative z-10">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-4xl font-black mb-4">GATHERING</motion.div>
                  <p className="text-slate-400 text-sm animate-pulse tracking-widest">사용자의 풍수 시드를 기반으로<br/>데이터 행운군을 추출 중입니다...</p>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Result */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8">
                <div className="relative inline-block px-8 py-4 bg-white/5 rounded-3xl border border-white/10 shadow-inner">
                  <div className="flex gap-2 justify-center mb-6">
                    {luckyNumbers.map((num, i) => (
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 + 0.5 }}
                        key={i}
                        className="w-10 h-10 flex items-center justify-center rounded-full font-black text-slate-950 shadow-lg"
                        style={{ backgroundColor: getThemeColor() }}
                      >
                        {num}
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed italic">
                    {FENG_SHUI_ELEMENTS[userChoice.element].advice}
                  </p>
                </div>

                <div className="space-y-3 pt-4">
                  <button className="w-full py-4 bg-indigo-600 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-indigo-500 transition-all">
                    <Share2 size={18} /> 당첨 기원 공유하기
                  </button>
                  <button className="w-full py-4 border border-slate-700 rounded-2xl flex items-center justify-center gap-2 text-sm text-slate-300 hover:bg-slate-800 transition-all">
                    <ExternalLink size={16} /> 행운의 인테리어 소품 보기
                  </button>
                  <button onClick={() => {setStep(1); setUserChoice({element:null, spot:null});}} className="pt-4 text-xs text-slate-600 flex items-center justify-center gap-1 mx-auto hover:text-slate-400">
                    <RefreshCw size={12} /> 다시 진단하기
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