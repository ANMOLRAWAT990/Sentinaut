import React, { useState, useEffect } from 'react';

const IMAGES = [
  {
    src: '/images/auth_side.png',
    quote: '"SentiNaut transformed how we interpret guest experiences. We no longer guess what went wrong; we know exactly where to assign our staff."',
    author: '— Director of Operations, The Alpine Lodge'
  },
  {
    src: '/images/auth_side_2.png',
    quote: '"Our Q3 metrics saw a 14% uplift directly attributable to the algorithmic anomaly detection. It is indispensable."',
    author: '— General Manager, Oceanview Suites'
  },
  {
    src: '/images/auth_side_3.png',
    quote: '"The signal-to-noise ratio in guest feedback used to overwhelm us. Now, we just execute on the highest ROI vectors."',
    author: '— VP of Guest Experience, Grand Resort'
  }
];

export function AuthCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden lg:block lg:w-[45%] xl:w-[50%] relative animate-in fade-in duration-700 overflow-hidden bg-black shrink-0">
      {IMAGES.map((img, idx) => (
        <div 
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
        >
          <img 
            src={img.src} 
            alt="Resort" 
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[10000ms] ease-out ${idx === currentIndex ? 'scale-105' : 'scale-100'}`} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute bottom-20 left-16 right-16 text-white max-w-2xl">
            <p className="text-2xl lg:text-3xl font-serif italic leading-relaxed text-white/90">
              {img.quote}
            </p>
            <p className="text-[11px] font-mono tracking-widest uppercase text-white/50 mt-8">
              {img.author}
            </p>
          </div>
        </div>
      ))}
      
      {/* Progress Dots */}
      <div className="absolute bottom-8 left-12 flex gap-2 z-20">
        {IMAGES.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
}
