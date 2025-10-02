
import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="h-36 flex items-center justify-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="relative">
        <span
          className="text-[120px] font-black text-transparent bg-clip-text 
                     bg-gradient-to-b from-cyan-400 via-purple-500 to-indigo-600"
          style={{
            WebkitTextStroke: '6px transparent',
            paintOrder: 'stroke fill',
            textShadow: `
              0 0 30px rgba(26, 255, 224, 0.4),
              0 0 20px rgba(168, 85, 247, 0.5),
              0 0 12px rgba(100, 200, 255, 0.6),
              0 0 6px rgba(255, 255, 255, 0.8)
            `,
          }}
        >
          V
        </span>
      </div>
    </div>
  );
};
