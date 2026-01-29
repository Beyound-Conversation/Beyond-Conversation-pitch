'use client';
import { useReveal } from '../hooks/useReveal';
import Background from '../components/Background';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Topics from '../components/Topics';
import LiveStage from '../components/LiveStage';
import HostSection from '../components/HostSection';
import Footer from '../components/Footer';

export default function LandingPage() {
  // Initialize the reveal animation observer
  useReveal();

  return (
    <main className="relative min-h-screen">
      <Background />
      <Navbar />
      
      <div className="flex flex-col gap-0 md:gap-10">
        <Hero />
        <Topics />
        <LiveStage />
        <HostSection />
      </div>

      <Footer />
    </main>
  );
}