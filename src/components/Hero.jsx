import Image from 'next/image';

export default function Hero() {
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
            <button className="bg-brand-orange hover:bg-orange-500 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-[0_10px_40px_rgba(255,95,0,0.3)] transition-all hover:-translate-y-1">
              Start The Journey
            </button>
            <button className="glass hover:bg-white/5 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all border-white/10 hover:border-white/30">
              Watch Trailer
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
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}