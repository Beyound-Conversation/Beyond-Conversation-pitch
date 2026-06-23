'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Play } from 'lucide-react';

export default function Hero() {
  const [showTrailer, setShowTrailer] = useState(false);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center pt-32 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Text Content */}
        <div className="reveal">
          <span className="inline-block px-4 py-1.5 rounded-full border border-brand-orange/30 bg-brand-orange/5 text-brand-orange text-[10px] font-bold tracking-[0.2em] uppercase mb-8 backdrop-blur-md">
            2026 Season Launch
          </span>
          
          <h2 className="font-playfair italic text-3xl md:text-4xl text-white/60 mb-4">
            &quot;Your share of this world&quot;
          </h2>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] mb-8 tracking-tight">
            12 TOPICS TO <br/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-white to-white/40">
              CHANGE YOUR LIFE
            </span>
          </h1>
          
          <p className="text-lg text-white/60 max-w-lg mb-12 border-l-2 border-brand-orange/50 pl-6 leading-relaxed">
            Join <span className="text-white font-bold">Eric Gugua</span> for a monthly series challenging your assumptions about money, identity, and the architecture of meaning.
          </p>
          
          <div className="flex flex-wrap gap-4">
            {/* UPDATED: Start The Journey links to Access Pass */}
            <Link href="/access-pass">
              <button className="bg-brand-orange hover:bg-orange-500 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-[0_10px_40px_rgba(255,95,0,0.3)] transition-all hover:-translate-y-1">
                Start The Journey
              </button>
            </Link>
            
            <button 
              onClick={() => setShowTrailer(true)}
              className="glass hover:bg-white/5 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all border-white/10 hover:border-white/30 flex items-center gap-2"
            >
              <Play size={18} className="text-brand-orange" /> Watch Trailer
            </button>
          </div>
        </div>
        
        {/* Image Content */}
        <div className="relative group reveal delay-200">
          <div className="absolute -inset-4 bg-brand-orange/10 blur-3xl rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-1000"></div>
          
          <div className="relative aspect-square rounded-[2.5rem] overflow-hidden glass p-3 border-white/10 rotate-2 group-hover:rotate-0 transition-transform duration-700 ease-out">
            <div className="w-full h-full rounded-4xl overflow-hidden bg-black relative">
              <Image 
                src="/images/host.png" 
                alt="Eric Gugua" 
                fill
                className="object-cover grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100 transition-all duration-1000"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
        
      </div>

      {/* --- TRAILER MODAL --- */}
      {showTrailer && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-10">
          <div className="relative w-full max-w-5xl aspect-video glass rounded-3xl border border-white/15 overflow-hidden shadow-2xl">
            {/* Close Button */}
            <button 
              onClick={() => setShowTrailer(false)}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 border border-white/15 flex items-center justify-center text-white/75 hover:text-white transition-colors hover:scale-105"
            >
              <X size={20} />
            </button>

            {/* Video Player */}
            <video
              src="https://assets.mixkit.co/videos/preview/mixkit-futuristic-digital-particle-flow-40081-large.mp4"
              controls
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </section>
  );
}