import Image from 'next/image';

export default function HostSection() {
  return (
    <section id="host" className="py-32 px-6">
      <div className="max-w-7xl mx-auto glass p-10 md:p-20 rounded-[3rem] border border-white/5 relative overflow-hidden reveal">
        
        {/* Background Blob */}
        <div className="absolute top-0 right-0 w-150 h-150 bg-brand-orange/10 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl md:text-5xl font-black mb-8">The Host</h2>
            <div className="space-y-6 text-white/70 text-lg leading-relaxed font-light">
              <p>
                Eric Gugua is a multidisciplinary philosopher and digital theorist focused on the intersection of human consciousness and emerging technology.
              </p>
              <p>
                Through <span className="text-white font-bold italic font-playfair">Beyond Conversation</span>, he hosts deep-dives into the unseen architectures that govern our daily lives, from financial structures to psychological schemas.
              </p>
              
              <div className="pt-10 mt-10 flex gap-10 border-t border-white/10">
                {[
                  { val: '12+', lbl: 'Episodes' }, 
                  { val: '4M+', lbl: 'Listeners' }, 
                  { val: '2026', lbl: 'Next Tour' }
                ].map((stat, i) => (
                  <div key={i} className={`reveal delay-${(i+1)*100}`}>
                    <div className="text-3xl font-black text-white mb-1">{stat.val}</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">{stat.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end reveal delay-200">
            <div className="aspect-3/4 w-full max-w-sm rounded-[2.5rem] overflow-hidden glass p-4 border border-white/10 rotate-3 transition-transform hover:rotate-0 duration-700 shadow-2xl">
              <Image
                src="/images/host.png"
                alt="Eric Portrait"
                width={1000}
                height={1333}
                className="w-full h-full object-cover rounded-4xl grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}