export interface User {
  id: string; // This will be the googleId
  googleId: string;
  name: string;
  email: string;
  picture: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string; // URL of the image for display
  timestamp: string;
}

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
