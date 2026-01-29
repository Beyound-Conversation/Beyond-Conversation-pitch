'use client';
import { useScrollParallax } from '../hooks/useScrollParallax';

export default function Background() {
  const gridRef = useScrollParallax();

  return (
    <>
      {/* 3D Grid Layer */}
      <div className="grid-container">
        <div ref={gridRef} className="grid-3d"></div>
      </div>
      
      {/* Atmosphere / Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Main Orange Glow */}
        <div className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] bg-brand-orange/10 blur-[150px] rounded-full animate-pulse" />
        
        {/* Secondary Detail Glow */}
        <div className="absolute bottom-[20%] right-[10%] w-[30rem] h-[30rem] bg-brand-orange/5 blur-[120px] rounded-full" />
        
        {/* Cool Tone Contrast */}
        <div className="absolute top-[40%] right-[20%] w-[20rem] h-[20rem] bg-blue-500/5 blur-[100px] rounded-full mix-blend-overlay" />
      </div>
    </>
  );
}