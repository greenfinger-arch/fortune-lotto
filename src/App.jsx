import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Home, Share2, RefreshCw, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";
import { FENG_SHUI_ELEMENTS, SPOTS } from "./constants";

const App = () => {
  const [step, setStep] = useState(1);
  const [userChoice, setUserChoice] = useState({ element: null, spot: null });
  const [luckyNumbers, setLuckyNumbers] = useState([]);
  const canvasRef = useRef(null);

  const generateFortuneNumbers = () => {
    const selectedElement = FENG_SHUI_ELEMENTS[userChoice.element];
    const numbers = new Set();
    const [min, max] = selectedElement.weightRange;
    while (numbers.size < 6) {
      let n =
        Math.random() < 0.4
          ? Math.floor(Math.random() * (max - min + 1)) + min
          : Math.floor(Math.random() * 45) + 1;
      if (n >= 1 && n <= 45) numbers.add(n);
    }
    return Array.from(numbers).sort((a, b) => a - b);
  };

  const handleShare = async () => {
    const shareData = {
      title: "2026 황금 기운 추출기",
      text: `나의 오행 기운으로 뽑은 행운의 번호: ${luckyNumbers.join(", ")}!`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("공유 링크가 복사되었습니다.");
      }
    } catch (err) {
      console.error("공유 실패:", err);
    }
  };

  useEffect(() => {
    let animationFrameId;
    if (step === 2) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        const particles = [];
        const color =
          FENG_SHUI_ELEMENTS[userChoice.element]?.color || "#fbbf24";
        for (let i = 0; i < 60; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
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
      const timer = setTimeout(() => {
        setLuckyNumbers(generateFortuneNumbers());
        setStep(3);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: [FENG_SHUI_ELEMENTS[userChoice.element].color, "#ffffff"],
        });
      }, 3500);
      return () => {
        clearTimeout(timer);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      };
    }
  }, [step, userChoice.element]);

  const getThemeColor = () =>
    userChoice.element
      ? FENG_SHUI_ELEMENTS[userChoice.element].color
      : "#f59e0b";

  return (
    /* 최상위: 100dvh를 주어 화면 전체를 차지하게 하고, flex-col과 py-8로 상하 여백 확보 */
    <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center font-sans overflow-hidden touch-none py-8">
      {/* 배경 광원 효과 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div
          className="w-[280px] h-[280px] rounded-full blur-[100px] opacity-20 transition-colors duration-1000"
          style={{ backgroundColor: getThemeColor() }}
        />
      </div>

      {/* 메인 카드: 너비(w-[92%])와 최대 높이(max-h-[80dvh])를 조정하여 콤팩트하게 교정 */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.15}
        /* w-[88%]: 양옆에 여백을 더 주어 '떠 있는 카드' 느낌을 강조합니다.
     max-w-[360px]: 가로가 너무 퍼지지 않게 꽉 잡아줍니다. (핵심!)
     max-h-[85dvh]: 세로 높이를 조금 더 허용하여 답답함을 해소합니다.
  */
        className="w-[88%] max-w-[360px] bg-slate-900/85 backdrop-blur-2xl rounded-[2.8rem] shadow-2xl border border-white/10 relative z-10 overflow-hidden flex flex-col max-h-[85dvh]"
      >
        <header className="pt-7 pb-3 text-center flex-shrink-0">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 6 }}
            className="inline-block mb-1"
          >
            <Sparkles style={{ color: getThemeColor() }} size={24} />
          </motion.div>
          <h1 className="text-base font-black tracking-[0.2em] text-white uppercase italic leading-tight">
            Fortune Lotto 2026
          </h1>
          <p className="text-[9px] text-slate-500 tracking-[0.3em] opacity-60 uppercase mt-1">
            Rank Lamp Lab
          </p>
        </header>

        <main className="px-6 pb-8 overflow-y-auto flex-grow custom-scrollbar">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 pt-2"
              >
                <section>
                  <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em] mb-4 text-center">
                    오행 에너지 선택
                  </h2>
                  <div className="grid grid-cols-5 gap-2">
                    {Object.keys(FENG_SHUI_ELEMENTS).map((key) => (
                      <button
                        key={key}
                        onClick={() =>
                          setUserChoice({ ...userChoice, element: key })
                        }
                        className={`py-3 rounded-2xl border-2 transition-all flex flex-col items-center ${
                          userChoice.element === key
                            ? "border-current bg-white/10 scale-105 shadow-lg shadow-current/10"
                            : "border-slate-800 opacity-40"
                        }`}
                        style={{
                          color:
                            userChoice.element === key
                              ? FENG_SHUI_ELEMENTS[key].color
                              : "#94a3b8",
                        }}
                      >
                        <span className="text-base font-black">
                          {FENG_SHUI_ELEMENTS[key].name[0]}
                        </span>
                        <span className="text-[7px] mt-1 font-bold">
                          {FENG_SHUI_ELEMENTS[key].name.split(" ")[1]}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em] mb-4 text-center">
                    생기 집중 공간
                  </h2>
                  <div className="space-y-2">
                    {SPOTS.map((spot) => (
                      <button
                        key={spot.id}
                        onClick={() =>
                          setUserChoice({ ...userChoice, spot: spot.id })
                        }
                        className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                          userChoice.spot === spot.id
                            ? "border-amber-500 bg-amber-500/15"
                            : "border-slate-800 bg-slate-800/40"
                        }`}
                      >
                        <div className="flex items-center gap-3 text-left">
                          <Home
                            size={16}
                            className={
                              userChoice.spot === spot.id
                                ? "text-amber-500"
                                : "text-slate-600"
                            }
                          />
                          <div>
                            <p className="text-sm font-bold text-slate-200">
                              {spot.name}
                            </p>
                            <p className="text-[8px] text-slate-500 leading-tight mt-0.5">
                              {spot.desc}
                            </p>
                          </div>
                        </div>
                        {userChoice.spot === spot.id && (
                          <CheckCircle2 size={14} className="text-amber-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </section>

                <button
                  disabled={!userChoice.element || !userChoice.spot}
                  onClick={() => setStep(2)}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs disabled:opacity-20 active:scale-95 transition-all shadow-xl shadow-amber-500/20"
                >
                  기운 분석 및 번호 생성
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                className="py-20 text-center relative flex flex-col justify-center items-center h-full min-h-[300px]"
              >
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                />
                <div className="relative z-10">
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-2xl font-black tracking-[0.4em] text-white uppercase"
                  >
                    Analyzing
                  </motion.div>
                  <p className="text-slate-500 text-[10px] mt-6 tracking-[0.2em] uppercase">
                    행운 데이터 추출 중...
                  </p>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" className="text-center space-y-6 pt-2">
                <div className="p-5 bg-slate-950/40 rounded-[2rem] border border-white/5">
                  <h3 className="text-[9px] font-bold text-slate-600 tracking-[0.4em] uppercase mb-4">
                    Your Lucky Numbers
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {luckyNumbers.map((num, i) => (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          damping: 12,
                          delay: i * 0.1,
                        }}
                        key={i}
                        className="w-9 h-9 flex items-center justify-center rounded-full font-black text-slate-950 text-xs shadow-lg"
                        style={{ backgroundColor: getThemeColor() }}
                      >
                        {num}
                      </motion.div>
                    ))}
                  </div>
                  <div className="bg-slate-900/90 p-4 rounded-xl border border-white/5">
                    <p className="text-[11px] text-slate-300 leading-relaxed italic">
                      "
                      {
                        FENG_SHUI_ELEMENTS[userChoice.element].advices[
                          Math.floor(
                            Math.random() *
                              FENG_SHUI_ELEMENTS[userChoice.element].advices
                                .length,
                          )
                        ]
                      }
                      "
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleShare}
                    className="w-full py-4 bg-indigo-600 rounded-2xl flex items-center justify-center gap-3 font-bold hover:bg-indigo-500 transition-all text-xs active:scale-95 shadow-lg shadow-indigo-600/20"
                  >
                    <Share2 size={16} /> 당첨 기원 결과 공유
                  </button>
                  <button
                    onClick={() => {
                      setStep(1);
                      setUserChoice({ element: null, spot: null });
                    }}
                    className="w-full py-3.5 border border-slate-800 rounded-2xl flex items-center justify-center gap-2 text-[10px] text-slate-500 hover:bg-slate-800 transition-all"
                  >
                    <RefreshCw size={12} /> 다시 분석하기
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </motion.div>
    </div>
  );
};

export default App;
