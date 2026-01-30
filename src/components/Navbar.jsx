'use client';
import Image from 'next/image';
import Link from 'next/link'; // ✅ ADDED: Import Link
import { useActiveSection } from '../hooks/useActiveSection';

export default function Navbar() {
  const { activeId, isScrolled } = useActiveSection();
  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'topics', label: 'Topics' },
    { id: 'live', label: 'Live Stage' },
    { id: 'host', label: 'The Host' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 px-6 py-4 transition-all duration-500 ${
        isScrolled ? 'glass border-b border-white/5 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-32 md:w-40">
            <Image 
              src="/images/logo.png"
              alt="Beyond Conversation Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <a 
              key={item.id}
              href={`#${item.id}`} 
              className={`nav-link ${activeId === item.id ? 'active' : ''}`}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA Button - ✅ UPDATED: Wrapped in Link */}
        <Link href="/access-pass">
          <button className="bg-brand-orange hover:bg-orange-500 text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(255,95,0,0.3)] transition-all hover:scale-105 active:scale-95">
            Access Pass
          </button>
        </Link>
      </div>
    </nav>
  );
}