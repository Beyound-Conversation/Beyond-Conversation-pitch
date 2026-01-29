import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  style: ['italic'], 
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata = {
  title: 'Beyond Conversation | Future of Discourse',
  description: 'A high-fidelity luxury futuristic website prototype.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="font-inter antialiased bg-brand-dark text-white selection:bg-brand-orange/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}