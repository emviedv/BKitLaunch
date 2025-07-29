import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const adminOffset = isAuthenticated && isAdmin ? 'top-10' : 'top-0';

  return (
    <header className={`bg-background border-b border-border sticky ${adminOffset} z-50`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="font-bold text-xl text-primary">BiblioKit</div>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </a>
          <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </a>
          <a href="/product" className="text-sm font-medium hover:text-primary transition-colors">
            Product
          </a>
          <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
            Contact
          </a>
        </nav>
        <div className="flex items-center space-x-4">
          <button className="btn-secondary">
            Sign In
          </button>
          <button className="btn-primary">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 