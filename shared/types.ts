// Supported languages
export type Language = 'es' | 'ht' | 'en' | 'arn';

// i18n name structure - each language has its own translation
export interface I18nName {
  es: string;
  ht: string;
  en: string;
  arn: string;
}

// Floor identifier
export type Floor = 1 | 2;

// Route point for navigation
export interface RoutePoint {
  x: number;
  y: number;
}

// Specialty - a medical specialty that belongs to a module
export interface Specialty {
  id: string;
  name: I18nName;
  module: string;
  floor: Floor;
  description?: I18nName;
  icon?: string;
}

// Module - a hospital module that contains specialties
export interface Module {
  id: string;
  name: I18nName;
  color: string;
  floor: Floor;
  location: I18nName;
  specialties: string[];
  nodeId?: string;
  x?: number;
  y?: number;
}

// Tip - contextual information for a module
export interface Tip {
  id: string;
  moduleId: string;
  title: I18nName;
  content: I18nName;
  type: 'payment' | 'hours' | 'instruction' | 'emergency';
}