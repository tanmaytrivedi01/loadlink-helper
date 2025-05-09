
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Plane, MapPin, Search, User } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 py-3 px-4 md:px-6 bg-white shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
            <Plane className="h-5 w-5 text-white transform -rotate-45" />
          </div>
          <div>
            <span className="text-xl font-semibold tracking-tight">LoadLink</span>
            <div className="flex items-center space-x-1 text-xs text-slate-500">
              <MapPin className="h-3 w-3" />
              <span>Heavy Haul Transport</span>
            </div>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-sm font-medium text-slate-700 hover:text-primary transition-colors">Shipping</a>
          <a href="#" className="text-sm font-medium text-slate-700 hover:text-primary transition-colors">Routes</a>
          <a href="#" className="text-sm font-medium text-slate-700 hover:text-primary transition-colors">Pricing</a>
          <a href="#" className="text-sm font-medium text-slate-700 hover:text-primary transition-colors">Partners</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-1">
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Button>
          <Button size="sm" variant="outline" className="flex items-center gap-1 text-slate-700 border-slate-300">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Sign in</span>
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
