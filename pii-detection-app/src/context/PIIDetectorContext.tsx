import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { PIIDetectorConfig, DetectionResult, ProcessingStats } from '../types';
import { piiranhaDetector } from '../utils/piiranhaDetector';

interface PIIDetectorState {
  config: PIIDetectorConfig;
  currentResult: DetectionResult | null;
  isProcessing: boolean;
  isInitializing: boolean;
  error: string | null;
  stats: ProcessingStats;
  history: DetectionResult[];
}

interface PIIDetectorContextType {
  state: PIIDetectorState;
  processText: (text: string) => Promise<DetectionResult>;
  exportData: (format: string) => void;
  updateConfig: (config: Partial<PIIDetectorConfig>) => void;
  clearHistory: () => void;
  resetStats: () => void;
}

const PIIDetectorContext = createContext<PIIDetectorContextType | undefined>(undefined);

export function PIIDetectorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PIIDetectorState>({
    config: {
      types: ['email', 'phone', 'name', 'creditCard', 'ssn', 'address', 'ipAddress'],
      confidenceThreshold: 0.8,
      mode: 'mask'
    },
    currentResult: null,
    isProcessing: false,
    isInitializing: true,
    error: null,
    stats: {
      totalDocuments: 0,
      totalDetections: 0,
      averageConfidence: 0,
      processingTime: 0
    },
    history: []
  });

  useEffect(() => {
    const initializeDetector = async () => {
      try {
        setState(prev => ({ ...prev, isInitializing: true, error: null }));
        await piiranhaDetector.initialize();
        setState(prev => ({ ...prev, isInitializing: false }));
        console.log('✅ PII Detector initialized successfully');
      } catch (error) {
        console.error('❌ PII Detector initialization failed:', error);
        setState(prev => ({ 
          ...prev, 
          isInitializing: false, 
          error: 'Failed to initialize PII detection model'
        }));
      }
    };
    
    initializeDetector();
  }, []);

  const processText = async (text: string): Promise<DetectionResult> => {
    setState(prev => ({ ...prev, isProcessing: true, error: null }));
    
    try {
      console.log(`🔍 Processing text (${text.length} chars)...`);
      const result = await piiranhaDetector.process(text, state.config);
      console.log(`✅ Found ${result.detections.length} PII entities`);

      setState(prev => ({ 
        ...prev, 
        currentResult: result,
        isProcessing: false,
        history: [result, ...prev.history].slice(0, 50), // Keep last 50
        stats: {
          totalDocuments: prev.stats.totalDocuments + 1,
          totalDetections: prev.stats.totalDetections + result.detections.length,
          averageConfidence: result.detections.length > 0 
            ? result.detections.reduce((sum, d) => sum + d.confidence, 0) / result.detections.length
            : prev.stats.averageConfidence,
          processingTime: prev.stats.processingTime + result.processingTime
        }
      }));

      return result;
    } catch (error) {
      console.error('❌ Processing failed:', error);
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: error instanceof Error ? error.message : 'Processing failed'
      }));
      throw error;
    }
  };

  const exportData = (format: string) => {
    if (!state.currentResult) {
      console.warn('No current result to export');
      return;
    }
    
    try {
      let exportContent: string;
      let filename: string;
      let mimeType: string;

      switch (format) {
        case 'json':
          exportContent = JSON.stringify({
            result: state.currentResult,
            stats: state.stats,
            exportedAt: new Date().toISOString()
          }, null, 2);
          filename = `pii-detection-${new Date().toISOString().split('T')[0]}.json`;
          mimeType = 'application/json';
          break;

        case 'csv':
          const csvHeaders = ['Type', 'Text', 'Confidence', 'Start', 'End'];
          const csvRows = state.currentResult.detections.map(d => [
            d.type, `"${d.text}"`, (d.confidence * 100).toFixed(1), d.start, d.end
          ]);
          exportContent = [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');
          filename = `pii-detections-${new Date().toISOString().split('T')[0]}.csv`;
          mimeType = 'text/csv';
          break;

        case 'txt':
        default:
          exportContent = state.currentResult.anonymizedText;
          filename = `pii-anonymized-${new Date().toISOString().split('T')[0]}.txt`;
          mimeType = 'text/plain';
          break;
      }

      // Create and download file
      const blob = new Blob([exportContent], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log(`📁 Exported as ${format.toUpperCase()}: ${filename}`);
    } catch (error) {
      console.error('💥 Export failed:', error);
      setState(prev => ({ 
        ...prev, 
        error: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    }
  };

  const updateConfig = (config: Partial<PIIDetectorConfig>) => {
    setState(prev => ({
      ...prev,
      config: { ...prev.config, ...config }
    }));
  };

  const clearHistory = () => {
    setState(prev => ({ ...prev, history: [] }));
  };

  const resetStats = () => {
    piiranhaDetector.resetStats();
    setState(prev => ({
      ...prev,
      stats: {
        totalDocuments: 0,
        totalDetections: 0,
        averageConfidence: 0,
        processingTime: 0
      }
    }));
  };

  return (
    <PIIDetectorContext.Provider value={{ 
      state, 
      processText, 
      exportData, 
      updateConfig,
      clearHistory,
      resetStats
    }}>
      {children}
    </PIIDetectorContext.Provider>
  );
}

export function usePIIDetector() {
  const context = useContext(PIIDetectorContext);
  if (!context) {
    throw new Error('usePIIDetector must be used within a PIIDetectorProvider');
  }
  return context;
}