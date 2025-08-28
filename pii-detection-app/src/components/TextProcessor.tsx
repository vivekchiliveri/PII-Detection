import React, { useState, useRef } from 'react';
import { Eye, Zap, Upload, Download, Copy, RotateCcw, RefreshCw } from 'lucide-react';
import { usePIIDetector } from '../context/PIIDetectorContext';

const TextProcessor: React.FC = () => {
  const { state, processText, exportData } = usePIIDetector();
  const [inputText, setInputText] = useState('');
  const [isConverted, setIsConverted] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleText = `Hi John Smith,

Please contact me at john.doe@email.com or call (555) 123-4567.
My SSN is 123-45-6789 and credit card is 4532 1234 5678 9012.

Address: 123 Main Street, New York, NY 10001
IP: 192.168.1.100

Best regards,
Jane Wilson`;

  const handleProcess = async () => {
    if (!inputText.trim()) return;
    
    try {
      const result = await processText(inputText);
      setDisplayText(inputText); // Initially show original
      setIsConverted(false); // Start in original state
    } catch (error) {
      console.error('Processing failed:', error);
    }
  };

  const handleToggleConversion = () => {
    if (!state.currentResult) return;
    
    if (isConverted) {
      // Restore to original
      setDisplayText(state.currentResult.originalText);
      setIsConverted(false);
    } else {
      // Convert to placeholders
      setDisplayText(state.currentResult.anonymizedText);
      setIsConverted(true);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File too large. Please select a file under 5MB.');
      return;
    }

    try {
      const content = await readFileContent(file);
      setInputText(content);
    } catch (error) {
      alert('Failed to read file.');
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="glass rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Eye className="w-6 h-6 mr-2" />
            Text Input
          </h2>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setInputText(sampleText)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
            >
              Load Sample
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors flex items-center"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
        
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter your text here for PII detection, upload a file, or load the sample text..."
          className="w-full h-40 bg-white bg-opacity-10 text-white placeholder-white placeholder-opacity-60 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          disabled={state.isProcessing}
        />

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-white text-opacity-70">
            Characters: {inputText.length.toLocaleString()}
            {inputText.length > 1000 && (
              <span className="ml-2 text-yellow-400">• Large text may take longer</span>
            )}
          </div>
          
          <button
            onClick={handleProcess}
            disabled={!inputText.trim() || state.isProcessing}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white rounded-lg font-semibold transition-all flex items-center"
          >
            {state.isProcessing ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Detect PII
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section - Right below input */}
      {state.currentResult && (
        <div className="glass rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Detected Text</h2>
            
            {/* Convert/Restore Toggle */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleToggleConversion}
                className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center ${
                  isConverted
                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isConverted ? (
                  <>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Show Original
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Show Placeholders
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isConverted 
                ? 'bg-green-500 bg-opacity-20 text-green-200' 
                : 'bg-red-500 bg-opacity-20 text-red-200'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                isConverted ? 'bg-green-400' : 'bg-red-400'
              }`}></div>
              <span className="font-medium">
                {isConverted ? 'Showing Placeholders (Safe)' : 'Showing Original (Contains PII)'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <button
              onClick={() => copyToClipboard(displayText || state.currentResult?.originalText || '')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors flex items-center"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Current View
            </button>
            
            <button
              onClick={() => exportData('txt')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
            
            <button
              onClick={() => exportData('json')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
            >
              JSON Export
            </button>
          </div>

          {/* Text Display */}
          <div className={`rounded-lg p-4 border-2 ${
            isConverted 
              ? 'bg-green-500 bg-opacity-10 border-green-500 border-opacity-30' 
              : 'bg-red-500 bg-opacity-10 border-red-500 border-opacity-30'
          }`}>
            <div className="text-white font-mono text-sm leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
              {displayText || state.currentResult?.originalText || ''}
            </div>
          </div>

          {/* No PII Detected Message */}
          {state.currentResult && state.currentResult.detections.length === 0 && (
            <div className="text-center py-8 mt-6">
              <div className="text-green-400 text-6xl mb-3">✓</div>
              <p className="text-white text-lg font-semibold">No PII Detected</p>
              <p className="text-white text-opacity-70">Your text appears to be clean of personally identifiable information.</p>
            </div>
          )}
        </div>
      )}

      {/* Detailed Analysis Section */}
      {state.currentResult && state.currentResult.detections.length > 0 && (
        <div className="space-y-6">
          {/* Results Header with Stats */}
          <div className="glass rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Detailed Analysis</h2>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">
                  {state.currentResult.detections.length}
                </div>
                <div className="text-sm text-white text-opacity-70">PII Found</div>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">
                  {(state.currentResult.accuracy * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-white text-opacity-70">Accuracy</div>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">
                  {state.currentResult.processingTime.toFixed(0)}ms
                </div>
                <div className="text-sm text-white text-opacity-70">Process Time</div>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">
                  {new Set(state.currentResult.detections.map(d => d.type)).size}
                </div>
                <div className="text-sm text-white text-opacity-70">PII Types</div>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                isConverted 
                  ? 'bg-orange-500 bg-opacity-20 text-orange-200' 
                  : 'bg-green-500 bg-opacity-20 text-green-200'
              }`}>
                <div className={`w-3 h-3 rounded-full ${
                  isConverted ? 'bg-orange-400' : 'bg-green-400'
                }`}></div>
                <span className="font-medium">
                  {isConverted ? 'Converted to Placeholders' : 'Original Text with PII'}
                </span>
              </div>
            </div>

            {/* Detections List */}
            {state.currentResult.detections.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Detected PII ({state.currentResult.detections.length} items)
                </h3>
                <div className="grid gap-2 max-h-40 overflow-y-auto">
                  {state.currentResult.detections.map((detection, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white bg-opacity-5 rounded-lg p-3"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full bg-blue-400`} />
                        <div>
                          <div className="text-white font-medium capitalize">
                            {detection.type}
                          </div>
                          <div className="text-white text-opacity-60 text-sm font-mono">
                            "{detection.text}"
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-green-400 text-sm font-semibold">
                          {(detection.confidence * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-white text-opacity-50">
                          confidence
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>


        </div>
      )}
    </div>
  );
};

export default TextProcessor;