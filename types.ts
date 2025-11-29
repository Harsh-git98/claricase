export interface User {
  id: string; // This will be the googleId
  googleId: string;
  name: string;
  email: string;
  pro: boolean;
  picture: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  hasImage?: boolean; // Flag to indicate image was attached (don't store actual image)
}

// ... rest of your types remain the same

export interface MindMapNode {
  id: string;
  label: string;
  x?: number;
  y?: number;
}

export interface MindMapEdge {
  source: string;
  target: string;
  label: string;
}

export interface MindMap {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
}

export interface CaseThread {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  summary: string;
  mindMap: MindMap;
  createdAt: string;
  updatedAt: string;
}

export interface GeminiResponse {
  chatResponse: string;
  summary: string;
  mindMap: MindMap;
}

export interface Note {
  id: string;
  userId?: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
