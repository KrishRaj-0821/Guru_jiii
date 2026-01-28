
export enum Language {
  ENGLISH_IN = 'English (IN)',
  HINDI = 'Hindi',
  HINGLISH = 'Hinglish'
}

export interface Resource {
  title: string;
  type: 'book' | 'article' | 'video' | 'website';
  url: string;
  description: string;
}

export interface EducationalContent {
  el15: string;
  deepDive: string;
  visualAnalogy: string;
  resources: Resource[];
  imageUrl?: string;
}

export interface UserProfile {
  sessionId: string;
  preferredLanguage: Language;
  recentTopics: string[];
  engagement: {
    totalRequests: number;
    lastActive: string;
  };
}

export interface ContentGenerationError {
  code: string;
  message: string;
}
