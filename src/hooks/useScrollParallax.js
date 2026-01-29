'use client';
import { useEffect, useRef } from 'react';

export function useScrollParallax() {
  const gridRef = useRef(null);

  useEffect(() => {
    let requestDisplay;
    
    const handleScroll = () => {
      if (!gridRef.current) return;
      
      const scrollY = window.scrollY;
      
      // Physics calculations
      // 60deg base tilt + subtle movement based on scroll
      const tilt = 60 + (scrollY * 0.005); 
      const move = scrollY * 0.15;
      const opacity = Math.max(0.15, 1 - scrollY / 3000);

      // Apply transforms directly to DOM for 60fps performance
      gridRef.current.style.transform = `rotateX(${tilt}deg) translateY(${move}px)`;
      gridRef.current.style.opacity = opacity;
    };

    const onScroll = () => {
      cancelAnimationFrame(requestDisplay);
      requestDisplay = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial call to set position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(requestDisplay);
    };
  }, []);

  return gridRef;
}