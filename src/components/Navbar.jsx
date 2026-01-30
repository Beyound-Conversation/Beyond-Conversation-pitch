'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useActiveSection } from '../hooks/useActiveSection';

export default function Navbar() {
  const { activeId, isScrolled } = useActiveSection();
  
  // UPDATED: Added '/' before the # so these links work from any page
  const navItems = [
    { id: 'hero', label: 'Home', href: '/#hero' },
    { id: 'topics', label: 'Topics', href: '/#topics' },
    { id: 'live', label: 'Live Stage', href: '/#live' },
    { id: 'host', label: 'The Host', href: '/#host' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 px-6 py-4 transition-all duration-500 ${
        isScrolled ? 'glass border-b border-white/5 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* UPDATED: Logo is now a Link to Home */}
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="relative h-20 w-32 md:w-40">
            <Image 
              src="/images/logo.png"
              alt="Beyond Conversation Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link 
              key={item.id}
              href={item.href} // Uses the new absolute path
              className={`nav-link ${activeId === item.id ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <Link href="/access-pass">
          <button className="bg-brand-orange hover:bg-orange-500 text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(255,95,0,0.3)] transition-all hover:scale-105 active:scale-95">
            Access Pass
          </button>
        </Link>
      </div>
    </nav>
  );
}