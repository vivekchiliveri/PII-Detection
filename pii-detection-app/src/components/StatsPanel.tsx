 import React from 'react';
import { X } from 'lucide-react';

interface StatsPanelProps {
  onClose: () => void;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ onClose }) => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Statistics</h2>
        <button onClick={onClose} className="text-white hover:text-gray-300">
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div className="text-white">
        <p>Statistics will be displayed here.</p>
      </div>
    </div>
  );
};

export default StatsPanel;
