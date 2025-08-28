import React, { useState } from 'react';
import { Shield, Zap, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import TextProcessor from './components/TextProcessor';
import ConfigPanel from './components/ConfigPanel';
import StatsPanel from './components/StatsPanel';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import { usePIIDetector } from './context/PIIDetectorContext';

function App() {
  const { state } = usePIIDetector();
  const [activePanel, setActivePanel] = useState<'config' | 'stats' | null>(null);

  // Show loading screen while initializing
  if (state.isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
        <LoadingSpinner 
          size="lg" 
          message="Initializing Piiranha v1 Model..."
          subMessage="Loading AI-powered PII detection engine..."
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-primary-500 to-purple-600">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white bg-opacity-10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white bg-opacity-10 rounded-full blur-3xl" />
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          <Header />
          
          <main className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center mb-6">
                <Shield className="w-16 h-16 text-white mr-4" />
                <div>
                  <h1 className="text-5xl font-bold text-white mb-2">
                    PII Detection
                  </h1>
                  <p className="text-xl text-white text-opacity-90">
                    AI-Powered Privacy Protection
                  </p>
                </div>
              </div>
              
              <p className="text-lg text-white text-opacity-80 max-w-2xl mx-auto mb-8">
                Detect and anonymize personally identifiable information using advanced 
                Piiranha v1 model with 98.27% accuracy. Complete privacy with client-side processing.
              </p>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <motion.div 
                  className="glass rounded-lg p-6 text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Lightning Fast</h3>
                  <p className="text-white text-opacity-70 text-sm">
                    Process documents in milliseconds with ONNX optimization
                  </p>
                </motion.div>

                <motion.div 
                  className="glass rounded-lg p-6 text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Shield className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">100% Private</h3>
                  <p className="text-white text-opacity-70 text-sm">
                    All processing happens locally - data never leaves your device
                  </p>
                </motion.div>

                <motion.div 
                  className="glass rounded-lg p-6 text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">98.27% Accuracy</h3>
                  <p className="text-white text-opacity-70 text-sm">
                    Advanced Piiranha v1 model with context-aware detection
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Main Application Layout - Full Width */}
            <div className="max-w-6xl mx-auto">
              <TextProcessor />
            </div>

            {/* Quick Stats - Only show when there are stats */}
            {state.stats.totalDocuments > 0 && (
              <motion.div 
                className="max-w-4xl mx-auto mt-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="glass rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-4 text-center">Processing Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{state.stats.totalDocuments}</div>
                      <div className="text-sm text-white text-opacity-70">Documents</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{state.stats.totalDetections}</div>
                      <div className="text-sm text-white text-opacity-70">PII Found</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {(state.stats.averageConfidence * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-white text-opacity-70">Avg. Confidence</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {state.stats.processingTime.toFixed(0)}ms
                      </div>
                      <div className="text-sm text-white text-opacity-70">Total Time</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Modal Panels */}
            <AnimatePresence>
              {activePanel && (
                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setActivePanel(null)}
                >
                  <motion.div
                    className="glass rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {activePanel === 'config' && (
                      <ConfigPanel onClose={() => setActivePanel(null)} />
                    )}
                    {activePanel === 'stats' && (
                      <StatsPanel onClose={() => setActivePanel(null)} />
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Display */}
            <AnimatePresence>
              {state.error && (
                <motion.div
                  className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg max-w-md z-50"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <p className="font-semibold">Error</p>
                      <p className="text-sm opacity-90">{state.error}</p>
                    </div>
                    <button
                      onClick={() => window.location.reload()}
                      className="ml-4 text-white hover:text-gray-200"
                    >
                      ✕
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Footer */}
          <footer className="mt-16 py-8 text-center text-white text-opacity-60">
            <p className="text-sm">
              © 2024 PII Detection App. Built with React, TypeScript, and Piiranha v1.
            </p>
            <p className="text-xs mt-2">
              Your privacy is protected - all processing happens locally in your browser.
            </p>
          </footer>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;