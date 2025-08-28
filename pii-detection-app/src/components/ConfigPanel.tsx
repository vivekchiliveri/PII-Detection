 import React from 'react';
import { X } from 'lucide-react';

interface ConfigPanelProps {
  onClose: () => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ onClose }) => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Configuration</h2>
        <button onClick={onClose} className="text-white hover:text-gray-300">
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div className="text-white">
        <p>Configuration options will be added here.</p>
      </div>
    </div>
  );
};

export default ConfigPanel;
