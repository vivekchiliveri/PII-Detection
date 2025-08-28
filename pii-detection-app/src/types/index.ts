export interface PIIDetection {
  type: PIIType;
  text: string;
  start: number;
  end: number;
  confidence: number;
  originalText: string;
}

export type PIIType = 
  | 'email' | 'phone' | 'ssn' | 'creditCard' | 'name' 
  | 'address' | 'ipAddress' | 'dateOfBirth' | 'passport' | 'custom';

export type AnonymizationMode = 'mask' | 'label' | 'remove' | 'replace';

export interface PIIDetectorConfig {
  types: PIIType[];
  confidenceThreshold: number;
  mode: AnonymizationMode;
}

export interface DetectionResult {
  originalText: string;
  anonymizedText: string;
  detections: PIIDetection[];
  processingTime: number;
  accuracy: number;
}

export interface ProcessingStats {
  totalDocuments: number;
  totalDetections: number;
  averageConfidence: number;
  processingTime: number;
}