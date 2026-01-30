'use client';
import { schedule } from '../data/schedule';
import { ArrowUpRight, Download } from 'lucide-react';

const TopicCard = ({ displayDate, title, desc, icon: Icon, index }) => (
  <div 
    className="glass-card p-8 rounded-4xl reveal flex flex-col h-full group"
    style={{ transitionDelay: `${(index % 3) * 100}ms` }}
  >
    <div className="flex justify-between items-start mb-6">
      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/80 border border-white/5 transition-all duration-500 group-hover:bg-brand-orange/20 group-hover:border-brand-orange/40 group-hover:text-brand-orange group-hover:scale-110">
        <Icon strokeWidth={1.5} size={24} />
      </div>
      <span className="px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold tracking-widest uppercase text-white/40 group-hover:text-brand-orange group-hover:border-brand-orange/30 transition-colors">
        {displayDate}
      </span>
    </div>
    
    <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-brand-orange transition-colors">
      {title}
    </h3>
    <p className="text-white/50 text-sm leading-relaxed mb-6 grow border-l border-white/10 pl-4">
      {desc}
    </p>
    
    <div className="pt-6 border-t border-white/5">
      <a href="#" className="inline-flex items-center gap-2 text-white/40 font-bold text-[10px] uppercase tracking-widest hover:text-white transition-colors group-hover:gap-3">
        View Module <ArrowUpRight size={14} />
      </a>
    </div>
  </div>
);

export default function Topics() {
  return (
    <section id="topics" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 reveal flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">The Syllabus</h2>
            <p className="text-white/50 text-lg max-w-xl font-playfair italic">
              12 months. 12 shifts in perspective. A complete curriculum for the modern mind.
            </p>
          </div>
          
          {/* UPDATED: Download Button functionality */}
          <a 
            href="/syllabus.pdf" 
            download="Beyond_Conversation_Syllabus.pdf"
            className="px-6 py-3 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all text-sm font-bold uppercase tracking-wider flex items-center gap-2 group"
          >
            <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
            Download Plan (PDF)
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedule.map((topic, i) => (
            <TopicCard key={topic.id} {...topic} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}