import React from 'react';
import { Shield } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="glass border-b border-white border-opacity-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-20 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">PII Detection</h1>
              <p className="text-xs text-white text-opacity-70">AI-Powered Privacy</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;