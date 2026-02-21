import React from 'react';
import heartImg from '../assets/heart_image.png';

const HeroSection = () => {
  return (
    <section className="w-full bg-[#030616] text-white overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes heartbeat {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-heart-calm {
          animation: heartbeat 3s ease-in-out infinite;
        }
      `}} />

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6 md:px-20 py-20">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-serif leading-tight">
            Revolutionizing Healthcare with AI
          </h1>
          <p className="text-gray-400 text-lg max-w-lg leading-relaxed">
            Redefine healthcare with AI—experience the power of faster 
            diagnostics and precisely tailored treatments.
          </p>
          <button className="bg-[#8ebae2] text-[#050a1e] px-10 py-4 rounded-lg font-bold hover:bg-[#a5c9eb] transition-all">
            Sign up for test
          </button>
        </div>
        
        <div className="flex justify-center items-center">
           <img 
             src={heartImg} 
             alt="Heart" 
             className="w-full max-w-md animate-heart-calm drop-shadow-[0_0_50px_rgba(142,186,226,0.3)]" 
           />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;