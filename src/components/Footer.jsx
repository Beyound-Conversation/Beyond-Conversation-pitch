import { Instagram, Youtube } from 'lucide-react'; // Social Icons

export default function Footer() {
  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/beyondconvention_/' },
    { name: 'YouTube', icon: Youtube, href: 'https://www.youtube.com/@Eric_Gugua/videos' },
  ];
  
  return (
    <footer className="py-24 border-t border-white/5 bg-black/40 backdrop-blur-xl relative z-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        <div className="reveal text-2xl font-black tracking-tighter flex items-center gap-2 mb-10">
          BEYOND<span className="text-brand-orange">CONVERSATION</span>
        </div>
        
        <div className="reveal delay-100 flex flex-wrap justify-center gap-10 mb-12 text-sm font-medium text-white/40">
          <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
        </div>
        
        <div className="reveal delay-200 flex gap-6 mb-12">
          {socialLinks.map(({ name, icon: Icon, href }) => (
            <a 
              key={name} 
              href={href} 
              className="w-12 h-12 glass rounded-full flex items-center justify-center border border-white/5 text-white/40 hover:border-brand-orange/50 hover:text-brand-orange hover:bg-brand-orange/10 transition-all hover:-translate-y-1"
            >
              <span className="sr-only">{name}</span>
              <Icon size={18} />
            </a>
          ))}
        </div>
        
        <p className="reveal delay-300 text-white/20 text-xs uppercase tracking-widest">
          © 2026 Beyond Conversation. All rights reserved.
        </p>
      </div>
    </footer>
  );
}