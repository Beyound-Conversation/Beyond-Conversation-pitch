'use client';
import { useState, useEffect } from 'react';

export function useActiveSection() {
  const [activeId, setActiveId] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Toggle navbar glass effect
      setIsScrolled(window.scrollY > 50);

      // Determine active section
      const sections = ['hero', 'topics', 'live', 'host'];
      const scrollPosition = window.scrollY + 150; // Offset for navbar

      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveId(section);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { activeId, isScrolled };
}