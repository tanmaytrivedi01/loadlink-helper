
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-8 glassmorphism-strong"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-white font-medium">L</span>
          </div>
          <span className="text-xl font-semibold tracking-tight">LoadLink</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Solutions</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Resources</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="hidden md:inline-flex">Sign In</Button>
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-none">Get Started</Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
