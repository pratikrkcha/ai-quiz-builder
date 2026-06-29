import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useGameStore } from '../store/useGameStore';
import './AIButtonLoader.css';

const TITLE_LETTERS = "AI Quiz Builder!".split("");
const COLORS = ["#f87171", "#fb923c", "#fbbf24", "#a3e635", "#34d399", "#2dd4bf", "#38bdf8", "#818cf8", "#a78bfa", "#e879f9", "#f43f5e", "#f87171", "#fb923c", "#fbbf24", "#a3e635", "#34d399"];

export const LandingPage = () => {
  const [topic, setTopic] = useState('');
  const [timerDuration, setTimerDuration] = useState<number>(30);
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [typewriterText, setTypewriterText] = useState('');
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  
  const [, setLocation] = useLocation();
  const setHostRole = useGameStore(state => state.setHostRole);

  useEffect(() => {
    if (!isLoading) {
      setTypewriterText('');
      setTypewriterIndex(0);
      return;
    }

    const lines = [
      "Reading your topic...",
      "Crafting questions...",
      "Almost ready..."
    ];
    
    const currentLineIdx = typewriterIndex % lines.length;
    const currentLine = lines[currentLineIdx];
    let charIdx = 0;
    let isMounted = true;
    
    const typeInterval = setInterval(() => {
      if (!isMounted) return;
      if (charIdx <= currentLine.length) {
        setTypewriterText(currentLine.substring(0, charIdx));
        charIdx++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          if (!isMounted) return;
          setTypewriterText('');
          setTypewriterIndex(prev => prev + 1);
        }, 1500);
      }
    }, 50);

    return () => {
      isMounted = false;
      clearInterval(typeInterval);
    };
  }, [isLoading, typewriterIndex]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || topic.length > 200) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const endpoint = `${baseUrl}/api/rooms`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), timerDuration, numQuestions })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Failed to create room');
      
      setHostRole(data.roomCode, data.hostToken, numQuestions);
      setLocation(`/host/${data.roomCode}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Network error. Please try again.';
      setError(errorMessage || 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 font-patrick text-ink"
    >
      {/* Hand drawn decor */}
      <div className="relative mb-8 md:mb-16 z-50 inline-block text-center mt-2 md:mt-6 animate-bounce-slow">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-kalam font-bold whitespace-normal md:whitespace-nowrap leading-tight text-center flex flex-wrap justify-center gap-[1px] md:gap-[2px]">
          {TITLE_LETTERS.map((letter, i) => (
            <span 
              key={i} 
              className={`inline-block ${letter === ' ' ? 'w-3 md:w-5' : 'text-stroke-lg hover:scale-110 transition-transform cursor-default'}`}
              style={{ 
                color: letter === ' ' ? 'transparent' : COLORS[i % COLORS.length],
                transform: `rotate(${i % 2 === 0 ? -4 : 4}deg) translateY(${i % 3 === 0 ? -2 : 2}px)`
              }}
            >
              {letter}
            </span>
          ))}
        </h1>
      </div>
      
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 relative z-10 mt-4 md:mt-0">
        {/* Host Card */}
        <div className="relative h-full">
          {/* Nerdy Mascot */}
          <div className="absolute -top-10 -left-4 md:-left-10 z-20 animate-float drop-shadow-md hidden md:block">
            <svg width="70" height="70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="40" fill="#fca5a5" stroke="#2d2d2d" strokeWidth="4"/>
              <rect x="25" y="40" width="20" height="15" rx="2" fill="white" stroke="#2d2d2d" strokeWidth="4"/>
              <rect x="55" y="40" width="20" height="15" rx="2" fill="white" stroke="#2d2d2d" strokeWidth="4"/>
              <line x1="45" y1="47" x2="55" y2="47" stroke="#2d2d2d" strokeWidth="4"/>
              <line x1="10" y1="47" x2="25" y2="47" stroke="#2d2d2d" strokeWidth="4"/>
              <line x1="75" y1="47" x2="90" y2="47" stroke="#2d2d2d" strokeWidth="4"/>
              <circle cx="35" cy="47" r="3" fill="#2d2d2d"/>
              <circle cx="65" cy="47" r="3" fill="#2d2d2d"/>
              <path d="M40 70 Q50 80 60 70" fill="none" stroke="#2d2d2d" strokeWidth="4" strokeLinecap="round"/>
              <path d="M20 25 L50 10 L80 25 L50 40 Z" fill="#fbbf24" stroke="#2d2d2d" strokeWidth="4" strokeLinejoin="round"/>
              <line x1="80" y1="25" x2="80" y2="40" stroke="#2d2d2d" strokeWidth="4"/>
              <circle cx="80" cy="40" r="3" fill="#ef4444"/>
            </svg>
          </div>
          <div className="bg-white border-[4px] border-ink p-5 md:p-8 rounded-wobbly shadow-[6px_6px_0px_0px_#2d2d2d] relative z-10 flex flex-col h-full">
            <h2 className="text-2xl md:text-3xl font-kalam mb-3 md:mb-4 font-bold border-b-[3px] border-dashed border-ink pb-2">Host a Quiz</h2>
            <form onSubmit={handleCreate} className="space-y-3 md:space-y-4 pt-2">
              <div>
                <label htmlFor="topic" className="block text-lg md:text-xl font-bold mb-1 md:mb-2">What's the topic?</label>
                <textarea 
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  maxLength={100}
                  placeholder="e.g. The history of Rome..."
                  aria-label="Quiz topic"
                  className="w-full bg-blue-50 border-[3px] border-ink p-3 md:p-4 rounded-wobblyMd focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none h-20 md:h-28 text-lg md:text-xl placeholder-ink/40 shadow-inner"
                />
                <div className="text-right text-sm text-ink/70 mt-1 font-bold">
                  {topic.length}/100
                </div>
              </div>
              
              <div className="pt-1 md:pt-2">
                <label className="block text-lg md:text-xl font-bold mb-1 md:mb-2">Timer Duration</label>
                <div className="flex gap-2 justify-between">
                  {[15, 30, 50, 120].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTimerDuration(t)}
                      className={`flex-1 py-1 md:py-2 font-kalam font-bold text-base md:text-lg rounded-wobbly transition-all border-[3px] border-ink active:translate-y-1 active:shadow-none ${
                        timerDuration === t 
                          ? 'bg-[#fde047] shadow-[2px_2px_0px_0px_#2d2d2d]' 
                          : 'bg-white shadow-[4px_4px_0px_0px_#2d2d2d] hover:bg-gray-50'
                      }`}
                    >
                      {t}s
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-1 md:pt-2">
                <label className="block text-lg md:text-xl font-bold mb-1 md:mb-2">Number of Questions</label>
                <div className="flex gap-2 justify-between">
                  {[5, 10, 15].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setNumQuestions(q)}
                      className={`flex-1 py-1 md:py-2 font-kalam font-bold text-base md:text-lg rounded-wobbly transition-all border-[3px] border-ink active:translate-y-1 active:shadow-none ${
                        numQuestions === q 
                          ? 'bg-[#fde047] shadow-[2px_2px_0px_0px_#2d2d2d]' 
                          : 'bg-white shadow-[4px_4px_0px_0px_#2d2d2d] hover:bg-gray-50'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-accent font-bold text-lg">{error}</p>}
              
              <div className="relative mt-4">
                <div className="sparkle-container">
                  <div className={`sparkle sparkle-1 ${isLoading ? 'show' : ''}`}>
                    <svg className="sparkle-inner" viewBox="0 0 28 28" fill="none">
                      <path d="M14 0C14 0 14 14 0 14C0 14 14 14 14 28C14 28 14 14 28 14C28 14 14 14 14 0Z" fill="#4285F4"/>
                    </svg>
                  </div>
                  <div className={`sparkle sparkle-2 ${isLoading ? 'show' : ''}`}>
                    <svg className="sparkle-inner" viewBox="0 0 28 28" fill="none">
                      <path d="M14 0C14 0 14 14 0 14C0 14 14 14 14 28C14 28 14 14 28 14C28 14 14 14 14 0Z" fill="#7C3AED"/>
                    </svg>
                  </div>
                  <div className={`sparkle sparkle-3 ${isLoading ? 'show' : ''}`}>
                    <svg className="sparkle-inner" viewBox="0 0 28 28" fill="none">
                      <path d="M14 0C14 0 14 14 0 14C0 14 14 14 14 28C14 28 14 14 28 14C28 14 14 14 14 0Z" fill="#06B6D4"/>
                    </svg>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isLoading || !topic.trim()}
                  className={`w-full border-[4px] border-ink py-3 text-2xl font-bold rounded-wobbly shadow-[6px_6px_0px_0px_#2d2d2d] active:translate-y-1 active:shadow-[2px_2px_0px_0px_#2d2d2d] transition-all flex items-center justify-center group ${
                    isLoading ? 'gemini-btn-loading' : 'bg-[#a3e635] hover:bg-[#84cc16] disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  <span className={isLoading ? '' : 'group-hover:-rotate-2 transition-transform'}>
                    {isLoading ? 'Generating...' : 'Generate Quiz'}
                  </span>
                </button>
              </div>

              <div className="text-center h-[60px] pt-2" style={{ visibility: isLoading ? 'visible' : 'hidden' }}>
                <div className="font-patrick text-[18px] text-[#4285F4] h-7 flex justify-center">
                  <div className="whitespace-nowrap">
                    {typewriterText}
                    <span className="animate-pulse ml-[1px]">|</span>
                  </div>
                </div>
                <div className="font-patrick text-[16px] text-[#4285F4] flex items-center justify-center mt-1">
                  <svg width="16" height="16" viewBox="0 0 28 28" fill="none" className="mr-1">
                    <path d="M14 0C14 0 14 14 0 14C0 14 14 14 14 28C14 28 14 14 28 14C28 14 14 14 14 0Z" fill="#4285F4"/>
                  </svg>
                  Powered by Gemini
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Join Card */}
        <div className="relative h-full">
          {/* Second Mascot */}
          <div className="absolute -top-10 -right-4 md:-right-10 z-20 animate-float drop-shadow-md hidden md:block" style={{ animationDelay: '1s' }}>
            <svg width="70" height="70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="40" fill="#67e8f9" stroke="#2d2d2d" strokeWidth="4"/>
              <circle cx="35" cy="45" r="5" fill="#2d2d2d"/>
              <circle cx="65" cy="45" r="5" fill="#2d2d2d"/>
              <path d="M35 65 Q50 75 65 65" fill="none" stroke="#2d2d2d" strokeWidth="4" strokeLinecap="round"/>
              <path d="M40 30 Q50 20 60 30" fill="none" stroke="#2d2d2d" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="bg-white border-[4px] border-ink p-6 md:p-8 rounded-wobblyMd shadow-[6px_6px_0px_0px_#2d2d2d] flex flex-col justify-center items-center text-center relative h-full">
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#fbbf24] rounded-full shadow-md z-20 border-[3px] border-ink animate-pulse"></div> {/* Thumbtack */}
            <h2 className="text-3xl md:text-4xl font-kalam mb-2 md:mb-4 font-bold">Have a Code?</h2>
            <p className="text-lg md:text-xl mb-4 md:mb-8 font-bold text-gray-700">Join your friends and prove your knowledge on the live leaderboard!</p>
            <button 
              onClick={() => setLocation('/join')}
              className="w-full bg-[#f43f5e] text-white border-[4px] border-ink py-4 text-3xl font-bold rounded-wobbly shadow-[6px_6px_0px_0px_#2d2d2d] active:translate-y-1 active:shadow-[2px_2px_0px_0px_#2d2d2d] hover:bg-[#e11d48] transition-all"
            >
              Play Now!
            </button>
          </div>
        </div>
      </div>

      {/* Info Cards Footer */}
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-12 mb-8 relative z-10 px-4 md:px-0">
        <div className="bg-[#1e3a8a] text-white border-[4px] border-ink p-5 rounded-wobbly shadow-[6px_6px_0px_0px_#2d2d2d] hover:-translate-y-1 transition-transform">
          <h3 className="text-2xl font-kalam font-bold mb-2 flex items-center gap-2">
            <span className="text-3xl drop-shadow-md">❓</span> About
          </h3>
          <p className="text-sm font-bold opacity-90 leading-relaxed">AI Quiz Builder! is a playful, real-time multiplayer trivia game. An AI reads your topic and instantly crafts unique questions. Challenge friends and see who's the biggest nerd!</p>
        </div>
        <div className="bg-[#1e3a8a] text-white border-[4px] border-ink p-5 rounded-wobbly shadow-[6px_6px_0px_0px_#2d2d2d] hover:-translate-y-1 transition-transform">
          <h3 className="text-2xl font-kalam font-bold mb-2 flex items-center gap-2">
            <span className="text-3xl drop-shadow-md">📰</span> Nerdy News
          </h3>
          <ul className="text-sm font-bold opacity-90 space-y-1 list-disc pl-4 leading-relaxed">
            <li>Redesigned the page!</li>
            <li>Mobile friendly UI</li>
            <li>Nerdy AI generation 🧠</li>
            <li>Real-time leaderboard</li>
          </ul>
        </div>
        <div className="bg-[#1e3a8a] text-white border-[4px] border-ink p-5 rounded-wobbly shadow-[6px_6px_0px_0px_#2d2d2d] hover:-translate-y-1 transition-transform">
          <h3 className="text-2xl font-kalam font-bold mb-2 flex items-center gap-2">
            <span className="text-3xl drop-shadow-md">🎮</span> How to play
          </h3>
          <div className="text-sm font-bold opacity-90 mt-2 space-y-2 leading-relaxed">
            <p>1. Type a topic (e.g. Physics)</p>
            <p>2. Share your room code</p>
            <p>3. Answer fast!</p>
            <p>4. Top score wins! 🏆</p>
          </div>
        </div>
      </div>
    </div>
  );
};
