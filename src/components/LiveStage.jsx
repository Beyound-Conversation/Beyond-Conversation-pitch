'use client';
import { useState, useEffect } from 'react';
import { schedule } from '../data/schedule';
import { WifiOff, MonitorPlay, Headphones, Bell } from 'lucide-react';

export default function LiveStage() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // FIX: Lazy initialization prevents the synchronous set state error
  const [nextEvent] = useState(() => {
    if (typeof window === 'undefined') return schedule[0]; 
    const now = new Date();
    return schedule.find(event => new Date(event.date) > now) || schedule[0];
  });

  useEffect(() => {
    if (!nextEvent) return;

    const timer = setInterval(() => {
      const eventTime = new Date(nextEvent.date).getTime();
      const currentTime = new Date().getTime();
      const difference = eventTime - currentTime;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextEvent]);

  if (!nextEvent) return null;

  return (
    <section id="live" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 reveal">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Live Stage</h2>
            <div className="text-white/50 text-xl flex items-center gap-3">
              Adaptive streaming. 
              <span className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider ml-4 border border-brand-orange/20 px-3 py-1 rounded-full bg-brand-orange/5">
                <WifiOff size={12} className="animate-pulse" /> Offline
              </span>
            </div>
          </div>
          
          <div className="mt-8 md:mt-0 flex gap-4 reveal delay-100">
            <div className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-xs font-bold uppercase tracking-wider text-white/60">
              <MonitorPlay size={14} /> 1080p HQ
            </div>
            <div className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-xs font-bold uppercase tracking-wider text-white/60">
              <Headphones size={14} /> Spatial Audio
            </div>
          </div>
        </div>

        <div className="relative aspect-video rounded-5xl overflow-hidden glass border border-white/10 shadow-2xl reveal group">
          <div className="absolute inset-0 bg-black flex items-center justify-center transition-transform duration-1000 group-hover:scale-105">
             <div className="text-center z-10">
                <p className="text-white/30 tracking-[0.4em] uppercase mb-6 text-xs font-bold">
                  Next broadcast: {nextEvent.displayDate}
                </p>
                <div className="flex gap-4 md:gap-10 text-5xl md:text-8xl font-black italic font-playfair">
                  <div className="flex flex-col items-center">
                    {String(timeLeft.days).padStart(2, '0')}
                    <span className="text-[10px] uppercase tracking-widest font-sans not-italic text-white/30 mt-4">Days</span>
                  </div>
                  <div className="text-white/20 animate-pulse">:</div>
                  <div className="flex flex-col items-center">
                    {String(timeLeft.hours).padStart(2, '0')}
                    <span className="text-[10px] uppercase tracking-widest font-sans not-italic text-white/30 mt-4">Hours</span>
                  </div>
                  <div className="text-white/20 animate-pulse">:</div>
                  <div className="flex flex-col items-center text-brand-orange">
                    {String(timeLeft.minutes).padStart(2, '0')}
                    <span className="text-[10px] uppercase tracking-widest font-sans not-italic text-brand-orange/50 mt-4">Mins</span>
                  </div>
                </div>
             </div>
             <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/80 opacity-80" />
          </div>
          
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-linear-to-t from-black via-black/80 to-transparent">
            <div className="max-w-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
              <h4 className="font-bold mb-2 uppercase text-xs tracking-widest text-brand-orange">Up Next</h4>
              <p className="text-xl font-medium leading-tight">{nextEvent.title}</p>
            </div>
            <button className="hidden md:flex px-6 py-3 rounded-full glass items-center gap-2 text-brand-orange border-brand-orange/20 hover:bg-brand-orange hover:text-white transition-all font-bold text-sm uppercase tracking-wider">
              <Bell size={16} /> Notify Me
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}