'use client';
import { useState, useEffect, useRef } from 'react';
import { schedule } from '../data/schedule';
import { WifiOff, Wifi, MonitorPlay, Headphones, Bell, Lock, X, Send, Volume2, VolumeX, ArrowLeft, Play, Pause } from 'lucide-react';
import Link from 'next/link';

// Predefined live chat messages for simulation
const MOCK_CHAT_POOL = [
  { user: "Sophia_L", text: "The argument on financial sovereignty is mind-blowing." },
  { user: "Marcus.K", text: "Is there a reading list for this session?" },
  { user: "David_A", text: "Eric is dropping gems here. This is exactly what I needed." },
  { user: "Elena_R", text: "Spatial audio is incredible, feels like being in the room." },
  { user: "Julian_V", text: "How does this connect to the thesis from Chapter 2?" },
  { user: "Clara_T", text: "The transition from physical currency to digital identity is inevitable." },
  { user: "Liam_H", text: "Mind blown by the perspective on time scarcity." },
  { user: "Amara_O", text: "Can we rewatch these sessions later?" },
  { user: "Nathan_W", text: "The architecture of meaning... deep stuff." },
  { user: "Zoe_M", text: "Hello from Berlin! Excited for this." },
];

export default function LiveStage() {
  const [mounted, setMounted] = useState(false);
  const [hasPass, setHasPass] = useState(false);
  const [nextEvent, setNextEvent] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // Interactive Broadcast Simulation States
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { user: "System", text: "Welcome to the Beyond Conversation Live Chat. Keep it respectful.", isSystem: true },
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  
  // Notification Modal States
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [notifyLoading, setNotifyLoading] = useState(false);

  const videoRef = useRef(null);
  const chatEndRef = useRef(null);

  // Set mounted on client and check access pass
  useEffect(() => {
    setMounted(true);
    const pass = localStorage.getItem('beyond_conversation_access_pass') === 'true';
    setHasPass(pass);
    
    // Find next event
    const now = new Date();
    const foundEvent = schedule.find(event => new Date(event.date) > now) || schedule[0];
    setNextEvent(foundEvent);
  }, []);

  // Update hasPass periodically in case they purchased on another tab/modal
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      const pass = localStorage.getItem('beyond_conversation_access_pass') === 'true';
      setHasPass(pass);
    }, 2000);
    return () => clearInterval(interval);
  }, [mounted]);

  // Countdown timer logic
  useEffect(() => {
    if (!nextEvent) return;

    const updateTimer = () => {
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
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [nextEvent]);

  // Chat Simulation Loop
  useEffect(() => {
    if (!isLiveActive) return;

    const chatInterval = setInterval(() => {
      const randomMsg = MOCK_CHAT_POOL[Math.floor(Math.random() * MOCK_CHAT_POOL.length)];
      setChatMessages(prev => [...prev, randomMsg]);
    }, 4000);

    return () => clearInterval(chatInterval);
  }, [isLiveActive]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Trigger reveal animations on elements inside this component after client-side mount
  useEffect(() => {
    if (!mounted || !nextEvent) return;

    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('#live .reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [mounted, nextEvent, isLiveActive]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    setChatMessages(prev => [...prev, { user: "You", text: currentMessage.trim(), isSelf: true }]);
    setCurrentMessage('');
  };

  const handleNotifySubmit = (e) => {
    e.preventDefault();
    if (!notifyEmail) return;

    setNotifyLoading(true);
    // Simulate API registration
    setTimeout(() => {
      setNotifyLoading(false);
      setNotifySuccess(true);
      setTimeout(() => {
        setShowNotifyModal(false);
        setNotifySuccess(false);
        setNotifyEmail('');
      }, 3000);
    }, 1500);
  };

  // Prevent layout shift/hydration mismatch during server rendering
  if (!mounted || !nextEvent) {
    return (
      <section id="live" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="w-48 h-10 bg-white/5 rounded-lg mb-4 animate-pulse" />
              <div className="w-64 h-6 bg-white/5 rounded-lg animate-pulse" />
            </div>
            <div className="w-40 h-10 bg-white/5 rounded-lg mt-6 md:mt-0 animate-pulse" />
          </div>
          <div className="aspect-video rounded-[2.5rem] bg-white/3 border border-white/5 animate-pulse flex items-center justify-center">
            <span className="text-white/20 text-sm tracking-wider uppercase font-bold">Initialising Live Stage...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="live" className="py-32 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Stage Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 reveal">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Live Stage</h2>
            <div className="text-white/50 text-xl flex items-center gap-3">
              Adaptive streaming. 
              {isLiveActive ? (
                <span className="flex items-center gap-2 text-green-500 text-xs font-bold uppercase tracking-wider ml-4 border border-green-500/20 px-3 py-1 rounded-full bg-green-500/5">
                  <Wifi size={12} className="animate-pulse" /> Live Now
                </span>
              ) : (
                <span className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider ml-4 border border-brand-orange/20 px-3 py-1 rounded-full bg-brand-orange/5">
                  <WifiOff size={12} className="animate-pulse" /> Offline
                </span>
              )}
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

        {/* --- LIVE BROADCAST INTERFACE --- */}
        {isLiveActive ? (
          <div className="glass rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl reveal flex flex-col lg:flex-row h-[550px] lg:h-[600px]">
            
            {/* Left Side: Video Player */}
            <div className="flex-grow bg-black relative flex items-center justify-center overflow-hidden">
              
              {/* Loop Video */}
              <video
                ref={videoRef}
                src="https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-41765-large.mp4"
                loop
                autoPlay
                muted={isMuted}
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              
              {/* Subtle ambient gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

              {/* Live Tag Overlay */}
              <div className="absolute top-6 left-6 flex items-center gap-2 bg-red-600/90 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                Live Broadcast
              </div>

              {/* Current Event Title Overlay */}
              <div className="absolute bottom-6 left-6 max-w-md pointer-events-none">
                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Broadcasting</p>
                <h3 className="text-xl font-bold leading-tight text-white">{nextEvent.title}</h3>
              </div>

              {/* Player Overlay Controls */}
              <div className="absolute bottom-6 right-6 flex items-center gap-3">
                <button 
                  onClick={() => {
                    if (videoRef.current) {
                      if (isVideoPlaying) {
                        videoRef.current.pause();
                      } else {
                        videoRef.current.play();
                      }
                      setIsVideoPlaying(!isVideoPlaying);
                    }
                  }}
                  className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white hover:text-brand-orange hover:bg-brand-orange/10 transition-colors"
                >
                  {isVideoPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white hover:text-brand-orange hover:bg-brand-orange/10 transition-colors"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </div>

              {/* Close/Exit Stage Button */}
              <button 
                onClick={() => setIsLiveActive(false)}
                className="absolute top-6 right-6 px-4 py-2 glass border border-white/10 rounded-full flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white hover:text-brand-orange hover:bg-brand-orange/10 transition-all hover:scale-105"
              >
                <ArrowLeft size={14} /> Exit Stage
              </button>
            </div>

            {/* Right Side: Live Chat */}
            <div className="w-full lg:w-[380px] border-t lg:border-t-0 lg:border-l border-white/15 flex flex-col h-[220px] lg:h-full bg-black/30 backdrop-blur-3xl">
              
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-widest text-white/60">Live Chat</h4>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">4,192 Watching</span>
                </div>
              </div>

              {/* Chat Feed */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, index) => (
                  <div key={index} className="text-sm">
                    {msg.isSystem ? (
                      <div className="text-white/30 text-xs italic text-center py-1 bg-white/2 rounded-md">
                        {msg.text}
                      </div>
                    ) : (
                      <div className="leading-tight">
                        <span className={`font-bold mr-2 text-xs uppercase tracking-wider ${
                          msg.isSelf ? 'text-brand-orange' : 'text-white/60'
                        }`}>
                          {msg.user}:
                        </span>
                        <span className="text-white/80">{msg.text}</span>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Join the discussion..."
                  className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand-orange transition-colors"
                />
                <button 
                  type="submit"
                  className="w-10 h-10 bg-brand-orange hover:bg-orange-500 rounded-xl flex items-center justify-center text-white transition-all active:scale-95 shadow-[0_0_15px_rgba(255,95,0,0.3)]"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* --- COUNTDOWN / PRE-STREAM DISPLAY --- */
          <div className="relative aspect-video rounded-5xl overflow-hidden glass border border-white/10 shadow-2xl reveal group">
            
            {/* Dark background with large countdown */}
            <div className="absolute inset-0 bg-black flex items-center justify-center transition-transform duration-1000 group-hover:scale-102">
               <div className="text-center z-10">
                  <p className="text-white/30 tracking-[0.4em] uppercase mb-6 text-xs font-bold">
                    Next broadcast: {nextEvent.displayDate}
                  </p>
                  <div className="flex gap-4 md:gap-10 text-5xl md:text-8xl font-black italic font-playfair justify-center items-center">
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
               
               {/* Ambient grid overlay */}
               <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/80 opacity-80 pointer-events-none" />
            </div>

            {/* Lock/Unlock Access Pass Overlay */}
            {hasPass ? (
              /* UNLOCKED VIEW: Play/Enter Broadcast option */
              <div className="absolute inset-0 flex flex-col items-center justify-end bg-linear-to-t from-black/90 via-black/40 to-transparent p-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="text-center">
                  <h4 className="text-brand-orange font-bold text-xs uppercase tracking-widest mb-2">Access Pass Activated</h4>
                  <p className="text-xl md:text-2xl font-black mb-6 max-w-xl">Enter the Live Stage to join the active feed.</p>
                  <button 
                    onClick={() => setIsLiveActive(true)}
                    className="bg-brand-orange hover:bg-orange-500 text-white px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-[0_0_35px_rgba(255,95,0,0.4)] transition-all hover:scale-105"
                  >
                    Simulate Live Broadcast
                  </button>
                </div>
              </div>
            ) : (
              /* LOCKED VIEW: Prompt to purchase Access Pass */
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 max-w-md">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-orange shadow-lg">
                    <Lock size={20} />
                  </div>
                  <h3 className="text-2xl font-black mb-3">Live Stage Locked</h3>
                  <p className="text-white/60 text-sm mb-6">
                    Access to broadcasts, interactive chat, and spatial audio requires an active pass.
                  </p>
                  <Link href="/access-pass">
                    <button className="bg-brand-orange hover:bg-orange-500 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-[0_0_25px_rgba(255,95,0,0.3)] transition-all hover:scale-105">
                      Get Access Pass
                    </button>
                  </Link>
                </div>
              </div>
            )}
            
            {/* Standard Bottom Info (when not hovered) */}
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex items-end justify-between transition-opacity duration-500 bg-linear-to-t from-black via-black/80 to-transparent group-hover:opacity-0 pointer-events-none">
              <div className="max-w-lg">
                <h4 className="font-bold mb-2 uppercase text-xs tracking-widest text-brand-orange">Up Next</h4>
                <p className="text-xl font-medium leading-tight">{nextEvent.title}</p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifyModal(true);
                }}
                className="hidden md:flex px-6 py-3 rounded-full glass items-center gap-2 text-brand-orange border-brand-orange/20 hover:bg-brand-orange hover:text-white transition-all font-bold text-sm uppercase tracking-wider pointer-events-auto"
              >
                <Bell size={16} /> Notify Me
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- NOTIFY ME MODAL --- */}
      {showNotifyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="glass p-8 rounded-[2.5rem] border border-white/10 max-w-md w-full relative overflow-hidden reveal">
            <button 
              onClick={() => setShowNotifyModal(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            {notifySuccess ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400">
                  <Bell size={24} className="animate-bounce" />
                </div>
                <h3 className="text-2xl font-black mb-2">You&apos;re Subscribed</h3>
                <p className="text-white/60 text-sm">
                  We will send you a calendar invite and email alert 15 minutes before the next live broadcast.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-black mb-3">Broadcast Alerts</h3>
                <p className="text-white/60 text-sm mb-6 leading-relaxed">
                  Enter your email address to receive notification reminders for the upcoming **{nextEvent.title}** session.
                </p>

                <form onSubmit={handleNotifySubmit} className="space-y-4">
                  <input
                    type="email"
                    required
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-orange transition-colors"
                  />
                  <button 
                    type="submit"
                    disabled={notifyLoading}
                    className="w-full bg-brand-orange hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(255,95,0,0.3)] transition-all flex items-center justify-center gap-2"
                  >
                    {notifyLoading ? "Subscribing..." : "Notify Me"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}