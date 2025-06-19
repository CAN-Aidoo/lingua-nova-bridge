
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-ocean-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">LN</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Lingua Nova Bridge</h1>
              <Badge variant="secondary" className="text-xs">
                200+ Languages Supported
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              History
            </Button>
            <Button variant="outline" size="sm">
              Settings
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
