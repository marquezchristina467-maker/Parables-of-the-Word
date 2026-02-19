
export interface Parable {
  id: string;
  title: string;
  reference: string;
  order: number;
  gospels: string[];
  shortDescription: string;
}

export interface ParableInsights {
  scriptureText: string;
  interpretation: string;
  clarification: string;
  modernExample: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

